import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocketService } from '../../websocket/websocket.service';
import { CacheService } from '../../cache/cache.service';
import { QuestService } from '../quest.service';
import { Inject, Logger, UseFilters, UseGuards } from '@nestjs/common';
import { WebSocketExceptionFilter } from 'src/filter/websocket-exception-filter';
import { LogIdAccessTokenGuard } from './log-id-access-token.guard';
import {
  DuksaeJumpMessagePattern as MessagePattern,
  MISSING_JUMP_PENALTY,
} from './constants/quest-duksaejump';
import {
  DuksaeJump,
  DuksaeJumpQuestData,
  ScoreMessageBody,
  StartDuksaeJumpMessageBody,
} from './dto/quest-duksaejump.dto';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class QuestDuksaeJumpGateWay
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

  afterInit(server: any) {
    Logger.log('init', QuestDuksaeJumpGateWay.name);
  }

  handleConnection(client: any, ...args: any[]) {
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
    data: StartDuksaeJumpMessageBody,
  ): Promise<void> {
    Logger.log(`Duksae-jump started: logId-${data.logId}`);

    const log = client.log;
    const quest: DuksaeJumpQuestData = JSON.parse(log.quest.quest);
    const questData = new DuksaeJump(data.logId, client.id, client.user?.id);
    const scoreKey = questData.scoreKey;

    const objects = ['tree', 'bird', 'rock']; // 장애물 종류
    let objectSpeed = quest.objectSpeed;
    let isGameover: boolean = false;

    // 동일한 logId 로 이미 퀘스트를 진행한 이력이 있는지 확인(중복 불가)
    const isAlreadyStarted = (await this.memory.find(scoreKey)) !== null;
    if (isAlreadyStarted) {
      throw new WsException('Already Started');
    }

    // 점수, 목숨 세팅
    await this.memory.set(scoreKey, 0);
    await this.memory.set(
      DuksaeJump.getHealthPointKey(client.id),
      quest.gameoverLimit,
    );

    // 이후 점수 계산을 위해 client id 와 score key 매핑
    await this.memory.set(client.id, scoreKey);

    // 합격 점수 컷 저장
    await this.memory.set(
      DuksaeJump.getPassingScoreKey(client.id),
      quest.passingScore,
    );

    // 덕새의 속도에 따라 장애물 수명(ttl)을 동적으로 조정
    const calTtl = () => {
      return (data.gamePanelOffsetWidth / objectSpeed) * 1000;
    };

    // 점점 빠르게 장애물 emit
    const emitObject = async () => {
      while (!isGameover) {
        const health = parseFloat(
          await this.memory.find(DuksaeJump.getHealthPointKey(client.id)),
        );
        if (health <= 0) {
          isGameover = true;
          return;
        }

        const randomObject =
          objects[Math.floor(Math.random() * objects.length)];
        client.emit(MessagePattern.Outbound.Object, randomObject);

        // 장애물 ttl 후 다음 장애물 등장
        const ttl = calTtl();
        await new Promise((resolve) => setTimeout(resolve, ttl));
      }
    };

    // 장애물 emit 속도 업데이트
    const updateObjectSpeed = async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, quest.speedIncreaseInterval),
      );

      while (!isGameover) {
        objectSpeed = Math.min(
          quest.objectMaxSpeed,
          objectSpeed * quest.speedIncreaseRate,
        );

        client.emit(MessagePattern.Outbound.Speed, objectSpeed);

        await new Promise((resolve) =>
          setTimeout(resolve, quest.speedIncreaseInterval),
        );
      }
    };

    await Promise.all([emitObject(), updateObjectSpeed()]);
  }

  @SubscribeMessage(MessagePattern.Inbound.Success)
  @UseGuards(LogIdAccessTokenGuard)
  async handleSuccess(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    data: ScoreMessageBody,
  ): Promise<void> {
    Logger.log(`quest:duksae-jump:success / score: ${data.score}`);

    const log = client.log;

    const passingScore = parseFloat(
      await this.memory.find(DuksaeJump.getPassingScoreKey(client.id)),
    );

    const isSucceeded: boolean = data.score >= passingScore;
    if (isSucceeded) {
      client.emit(MessagePattern.Outbound.Result, {
        result: isSucceeded,
        score: data.score,
      });
    }

    await this.questService.handleResult(isSucceeded, log);
  }

  @SubscribeMessage(MessagePattern.Inbound.Fail)
  async handleFail(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    data: ScoreMessageBody,
  ): Promise<void> {
    const health = await this.memory.incrbyfloat(
      DuksaeJump.getHealthPointKey(client.id),
      -MISSING_JUMP_PENALTY,
    );

    if (health <= 0) {
      const score = data.score;
      client.emit(MessagePattern.Outbound.GameOver, score);
      this.handleDisconnect(client);
    } else {
      client.emit(MessagePattern.Outbound.Health, health);
    }
  }
}
