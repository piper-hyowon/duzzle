import { UserRepositoryService } from './../repository/service/user.repository.service';
import { In } from 'typeorm';
import { Inject, Injectable, Logger } from '@nestjs/common';
import dayjs from 'dayjs';

import { QuestRepositoryService } from '../repository/service/quest.repository.service';
import {
  GetResultRequest,
  StartRandomQuestResponse,
} from './rest/dto/quest.dto';
import { QuestTokenReward } from 'src/constant/quest';
import { LogQuestEntity } from '../repository/entity/log-quest.entity';
import { LimitExceededError } from 'src/types/error/application-exceptions/409-conflict';
import { NoOngoingQuestError } from 'src/types/error/application-exceptions/400-bad-request';
import { GuestInfo } from './rest/types/guest';
import { QuestType } from '../repository/enum/quest.enum';
import { CacheService } from '../cache/cache.service';
import { SmartContractInteractionService } from '../blockchain/smart-contract-interaction.service';
import { ContentNotFoundError } from 'src/types/error/application-exceptions/404-not-found';
import { QuestEntity } from '../repository/entity/quest.entity';

@Injectable()
export class QuestService {
  private latency: number = 2000; // 퀘스트 응답/처리 등을 고려한 추가 시간, milliseconds
  constructor(
    private readonly questRepositoryService: QuestRepositoryService,

    @Inject(SmartContractInteractionService)
    private readonly smartContractInteraction: SmartContractInteractionService,

    @Inject(CacheService)
    private readonly memory: CacheService,

    // TODO: 시연용 API 를 위한 임시 코드
    private readonly userRepositoryService: UserRepositoryService,
  ) {}

  async getRandomQuest(userId: number): Promise<StartRandomQuestResponse> {
    let quest: QuestEntity;
    // 미시도 퀘스트 우선 조회
    quest = await this.questRepositoryService.findUnattemptedQuest(userId);

    if (!quest) {
      // 실패한 퀘스트에서 조회
      const randomQuestFailed =
        await this.questRepositoryService.randomQuestFailed(userId);
      if (!randomQuestFailed) {
        throw new LimitExceededError();
      } else {
        quest = randomQuestFailed;
      }
    }

    const log = await this.questRepositoryService.insertLog({
      userId,
      questId: quest.id,
    });

    return StartRandomQuestResponse.from(quest, log.id);
  }

  async getRandomQuestForGuest(
    guestInfo: GuestInfo,
  ): Promise<StartRandomQuestResponse> {
    const quests = await this.questRepositoryService.findQuests([]);
    const randomQuestIndex = Math.floor(Math.random() * quests.length);
    const quest = quests[randomQuestIndex];

    const log = await this.questRepositoryService.insertLog({
      questId: quest.id,
      isGuestUser: true,
      guestInfo,
    });

    return StartRandomQuestResponse.from(quest, log.id);
  }

  async getQuestByTypeForDemo(
    guestInfo: GuestInfo,
    type: QuestType,
  ): Promise<StartRandomQuestResponse> {
    const quest = await this.questRepositoryService.findQuestByType([type]);

    const log = await this.questRepositoryService.insertLog({
      questId: quest[0].id,
      isGuestUser: true,
      guestInfo,
    });

    return StartRandomQuestResponse.from(quest[0], log.id);
  }

  async isAlreadyOngoing(
    userId: number,
  ): Promise<{ isAlreadyOngoing: boolean; log?: LogQuestEntity }> {
    const logs =
      await this.questRepositoryService.findNotCompletedLogsByUser(userId);
    // quest 가 삭제되어도, log 는 남아있기 때문에 quest !== null 일 경우만 체크
    if (logs.length && logs[0].quest) {
      const isTimedOut: boolean = dayjs().isAfter(
        dayjs(logs[0].createdAt).add(
          logs[0].quest.timeLimit * 1000 + this.latency,
          'millisecond',
        ),
      );

      return { isAlreadyOngoing: !isTimedOut, log: logs[0] };
    }

    return { isAlreadyOngoing: false };
  }

  async findLogsByUser(userId: number): Promise<LogQuestEntity[]> {
    return await this.questRepositoryService.findLogsByUser(userId);
  }

  async findLogByIdAndUser(
    id: number,
    userId: number,
  ): Promise<LogQuestEntity> {
    return await this.questRepositoryService.findLogByIdAndUser(id, userId);
  }

  /**
   * 퀘스트 결과 처리
   * @param userId null 이면 게스트
   * @returns 성공 여부
   */
  async getResult(
    userId: number | null,
    params: GetResultRequest,
  ): Promise<boolean> {
    const { logId, answer } = params;
    let log: LogQuestEntity;
    if (userId) {
      log = await this.questRepositoryService.findLogByIdAndUser(logId, userId);
    } else {
      log = await this.questRepositoryService.findGuestLogById(logId);
    }

    if (!log || log.isCompleted) {
      throw new NoOngoingQuestError();
    }

    const isSucceeded: boolean =
      dayjs().isBefore(
        dayjs(log.createdAt).add(
          log.quest.timeLimit * 1000 + this.latency,
          'millisecond',
        ),
      ) && log.quest.answer === answer.map((e) => e.trim()).join(',');

    this.handleResult(isSucceeded, log);

    return isSucceeded;
  }

  async handleResult(isSucceeded: boolean, log: LogQuestEntity) {
    log.isCompleted = true;
    log.isSucceeded = isSucceeded;

    // 성공 시, 토큰 지급(게스트는 제외)
    if (isSucceeded && !log.isGuestUser) {
      try {
        await this.smartContractInteraction.mintDalToken(
          log.user.walletAddress,
          QuestTokenReward,
        );
        log.rewardReceived = true;
      } catch (err) {
        Logger.error(err, err.stack);
        log.rewardReceived = false;
      }
    }

    await this.questRepositoryService.updateLog(log);
  }

  async completeLog(log: LogQuestEntity): Promise<void> {
    log.isCompleted = true;
    await this.questRepositoryService.updateLog(log);
  }

  async deleteLogByType(
    walletAddress: string,
    types: QuestType[],
  ): Promise<void> {
    const user =
      await this.userRepositoryService.findUserByWalletAddress(walletAddress);

    if (!user) {
      throw new ContentNotFoundError('user', walletAddress);
    }
    const quests = await this.questRepositoryService.findQuestByType(types);

    await this.questRepositoryService.deleteLogs({
      questId: In(quests.map((e) => e.id)),
      userId: user.id,
    });
  }
}
