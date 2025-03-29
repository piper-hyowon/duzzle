import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LogTransactionEntity } from '../entity/log-transaction.entity';

@Injectable()
export class TransactionRepositoryService {
  constructor(
    @InjectRepository(LogTransactionEntity)
    private txLogRepository: Repository<LogTransactionEntity>,
  ) {}

  async getAllLogs() {
    return await this.txLogRepository.find();
  }

  async upsertLogs(entities: Partial<LogTransactionEntity>[]) {
    await this.txLogRepository.upsert(entities, [
      'transactionHash',
      'transactionIndex',
      'topic',
      'contractAddress',
      'from',
      'to',
      'tokenId',
    ]);
  }

  async findLatestSyncedBlockNumber(): Promise<number | null> {
    const blockNumber = await this.txLogRepository.maximum('blockNumber');

    return blockNumber;
  }
}
