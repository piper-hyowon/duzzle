import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In, IsNull, FindOptionsWhere } from 'typeorm';

import { QuestEntity } from '../entity/quest.entity';
import { LogQuestEntity } from '../entity/log-quest.entity';
import { QuestType } from '../enum/quest.enum';

@Injectable()
export class QuestRepositoryService {
  constructor(
    @InjectRepository(QuestEntity)
    private questRepository: Repository<QuestEntity>,

    @InjectRepository(LogQuestEntity)
    private logRepository: Repository<LogQuestEntity>,
  ) {}

  async findQuestById(id: number): Promise<QuestEntity> {
    const quest = await this.questRepository.findOneBy({ id });

    return quest;
  }

  async findQuestByType(types: QuestType[]): Promise<QuestEntity[]> {
    const quest = await this.questRepository.findBy({ type: In(types) });

    return quest;
  }

  async findQuests(excludes?: number[]): Promise<QuestEntity[]> {
    if (excludes?.every((e) => !!e)) {
      return this.questRepository.findBy({ id: Not(In(excludes)) });
    }

    return this.questRepository.find();
  }

  /**
   * 시도하지 않은 퀘스트
   */
  async findUnattemptedQuest(userId: number): Promise<QuestEntity> {
    return this.questRepository
      .createQueryBuilder('q')
      .leftJoin(
        LogQuestEntity,
        'lq',
        'lq.questId = q.id AND lq.userId = :userId',
        { userId },
      )
      .where('lq.questId IS NULL')
      .orderBy('random()')
      .limit(1)
      .getOne();
  }

  /**
   * 성공하지 못한 퀘스트
   */
  async randomQuestFailed(userId: number): Promise<QuestEntity> {
    return this.questRepository
      .createQueryBuilder('q')
      .leftJoin(
        LogQuestEntity,
        'lg',
        'lq.questId = q.id AND lq.userId = :userId',
        { userId },
      )
      .where('lq.questId IS NOT NULL')
      .andWhere('lq.isSucceeded != true or isSucceeded IS NULL')
      .orderBy('random()')
      .limit(1)
      .getOne();
  }

  async findNotCompletedLogsByUser(userId: number): Promise<LogQuestEntity[]> {
    const logs = await this.logRepository.find({
      where: {
        userId,
        isCompleted: IsNull(),
      },
      relations: {
        quest: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return logs;
  }

  async insertLog(log: Partial<LogQuestEntity>): Promise<LogQuestEntity> {
    const logEntity = this.logRepository.create(log);
    await this.logRepository.save(logEntity);

    return logEntity;
  }

  async updateLog(log: LogQuestEntity): Promise<void> {
    await this.logRepository.update(log.id, log);
  }

  async findLogsByUser(userId: number): Promise<LogQuestEntity[]> {
    const log = await this.logRepository.find({
      where: { userId },
      relations: { quest: true, user: true },
      order: { createdAt: 'DESC' },
    });

    return log;
  }

  async findLogByIdAndUser(
    id: number,
    userId: number,
  ): Promise<LogQuestEntity> {
    const log = await this.logRepository.findOne({
      where: { id, userId },
      relations: { quest: true, user: true },
    });

    return log;
  }

  async findGuestLogById(id: number): Promise<LogQuestEntity> {
    const log = await this.logRepository.findOne({
      where: { id, isGuestUser: true },
      relations: { quest: true },
    });

    return log;
  }

  // TODO: 시연용
  async deleteLogs(where: FindOptionsWhere<LogQuestEntity>): Promise<void> {
    await this.logRepository.delete(where);
  }
}
