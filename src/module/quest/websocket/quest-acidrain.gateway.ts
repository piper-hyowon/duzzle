/**
 * /quest/start POST 에서 산성비가 랜덤으로 나온 유저만
 * 산성비 퀘스트 시작 가능(url 로 유효하지 않은 접근 차단)
 *
 * 퀘스트 시작시 LogId, accessToken 확인 후 word 하나씩 전송(게스트 유저의 경우 LogId 만 확인)
 */

// TODO: WsException 에러 코드로 관리(매직 스트링 Enum 으로 변경)

import { Inject, Logger, UseFilters, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { WebSocketService } from '../../websocket/websocket.service';
import { WebSocketExceptionFilter } from 'src/filter/websocket-exception-filter';
import { CacheService } from 'src/module/cache/cache.service';

import { QuestService } from 'src/module/quest/quest.service';
import {
  CORRECT_ANSWER_POINTS,
  AcidRainMessagePattern as MessagePattern,
  MISSING_ANSWER_PENALTY,
  WRONG_ANSWER_PENALTY,
} from './constants/quest-acidrain';
import {
  AcidRain,
  AcidRainQuestData,
  AnswerMessageBody,
  StartAcidRainMessageBody,
} from './dto/quest-acidrain.dto';
import { LogIdAccessTokenGuard } from './log-id-access-token.guard';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class QuestAcidRainGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly webSocketService: WebSocketService,
    @Inject(CacheService)
    private readonly memory: CacheService,

    @Inject(QuestService)
    private readonly questService: QuestService,
  ) {}

  afterInit(server: Server) {
    Logger.log('init', QuestAcidRainGateway.name);
  }

  handleConnection(client: Socket) {
    Logger.log(`Client connected: ${client.id}`);
    this.webSocketService.addClient(client);
  }

  handleDisconnect(client: Socket) {
    Logger.log(`Client disconnected: ${client.id}`);
    this.webSocketService.removeClient(client);
  }

  @UseFilters(new WebSocketExceptionFilter())
  @UseGuards(LogIdAccessTokenGuard)
  @SubscribeMessage(MessagePattern.Inbound.Start)
  async handleStart(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    data: StartAcidRainMessageBody,
  ): Promise<void> {
    const log = client.log;
    const quest: AcidRainQuestData = JSON.parse(log.quest.quest);
    const words: string[] = log.quest.answer.split(',');
    const questData = new AcidRain(data.logId, client.id, client.user?.id);
    const scoreKey = questData.scoreKey;

    // 동일한 logId 로 이미 퀘스트를 진행한 이력이 있는지 확인(중복 불가)
    const isAlreadyStarted = (await this.memory.find(scoreKey)) !== null;
    if (isAlreadyStarted) {
      throw new WsException('Already Started');
    }

    // 단어 하나당 수명
    const ttl: number =
      (data.gamePanelOffsetHeight / quest.dropDistance) * quest.dropIntervalMs;

    const maxPlayTime = words.length * quest.newWordIntervalMs + ttl;

    // 점수는 0으로 세팅
    await this.memory.set(scoreKey, 0);

    // 이후 정답 확인, 점수 계산을 위해 client id 와 score key 매핑
    await this.memory.set(client.id, scoreKey);

    // 정답 확인시 마지막 단어일 경우 게임 결과를 즉시 알려주기 위해
    // 합격 점수 컷 저장
    await this.memory.set(
      AcidRain.getPassingScoreKey(client.id),
      quest.passingScore,
    );

    let wordMissedCount: number = 0;
    let isGameover: boolean = false;

    // 일정 간격(newWordIntervalMs) 두고 새 단어 emit
    const emitWordBatch = async () => {
      for (let i: number = 0; i < words.length; i++) {
        if (isGameover) {
          return;
        }

        client.emit(MessagePattern.Outbound.Word, words[i]);

        await this.memory.set(
          AcidRain.getWordKey(client.id, words[i]),
          1,
          maxPlayTime,
        );
        // 마지막 단어 표시
        if (i === words.length - 1) {
          await this.memory.set(AcidRain.getLastWordKey(client.id), words[i]);
        }

        await new Promise((resolve) =>
          setTimeout(resolve, quest.newWordIntervalMs),
        );
      }
    };

    // 놓친 단어 카운트. 일정 개수(gameoverLimit) 초과시 게임 종료 emit
    const monitorMissedWords = async () => {
      await new Promise((resolve) => setTimeout(resolve, ttl));

      for (let i: number = 0; i < words.length; i++) {
        if (isGameover) {
          return;
        }

        // 해당 단어가 아직 지워지지 않고 있는 경우, 놓쳤다고 판단
        let key = AcidRain.getWordKey(client.id, words[i]);
        if ((await this.memory.exists(key)) === 1) {
          await this.memory.remove(key); // 놓친 단어는 삭제
          client.emit(MessagePattern.Outbound.Miss, {
            word: words[i],
            count: ++wordMissedCount,
          });
          const score = await this.memory.incrbyfloat(
            scoreKey,
            -MISSING_ANSWER_PENALTY,
          );
          client.emit(MessagePattern.Outbound.Score, score);

          // gameoverLimit 번 이상 놓칠 경우 게임 오버
          if (wordMissedCount >= quest.gameoverLimit) {
            client.emit(MessagePattern.Outbound.GameOver, score);
            isGameover = true;
            this.handleDisconnect(client);
            return;
          }
        }
        await new Promise((resolve) =>
          setTimeout(resolve, quest.newWordIntervalMs),
        );
      }
    };

    // maxPlayTime 후엔 게임 종료 후 승패 판단
    setTimeout(async () => {
      if (isGameover) {
        return;
      }
      const score = parseFloat(await this.memory.find(scoreKey));
      const isSucceeded: boolean = score >= quest.passingScore;
      client.emit(MessagePattern.Outbound.Result, {
        result: isSucceeded,
        score,
      });

      await this.questService.handleResult(isSucceeded, log);
    }, maxPlayTime);

    await Promise.all([emitWordBatch(), monitorMissedWords()]);
  }

  @SubscribeMessage(MessagePattern.Inbound.Answer)
  async handleAnswer(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    data: AnswerMessageBody,
  ): Promise<void> {
    const scoreKey = await this.memory.find(client.id);
    const key = AcidRain.getWordKey(client.id, data.answer);
    const hit = (await this.memory.exists(key)) === 1;

    if (hit) {
      const score = await this.memory.incrbyfloat(
        scoreKey,
        CORRECT_ANSWER_POINTS,
      );
      client.emit(MessagePattern.Outbound.Score, score);
      client.emit(MessagePattern.Outbound.Hit, data.answer); // 화면에서 사라지게 하기 위해 전달

      // 점수를 획득한 단어는 메모리에서 삭제
      await this.memory.remove(key);

      const lastword = await this.memory.find(
        AcidRain.getLastWordKey(client.id),
      );

      // 맞춘 단어가 마지막 단어일 경우,
      if (data.answer === lastword) {
        const passingScore = parseFloat(
          await this.memory.find(AcidRain.getPassingScoreKey(client.id)),
        );
        const isSucceeded: boolean = score >= passingScore;
        client.emit(MessagePattern.Outbound.Result, {
          result: isSucceeded,
          score,
        });
      }
    } else {
      const score = await this.memory.incrbyfloat(
        scoreKey,
        -WRONG_ANSWER_PENALTY,
      );
      client.emit(MessagePattern.Outbound.Score, score);
      client.emit(MessagePattern.Outbound.Wrong);
    }
  }
}
