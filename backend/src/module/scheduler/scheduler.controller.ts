import { Controller, Inject, Post } from '@nestjs/common';

import { TransactionCollectionScheduler } from './transaction-collection.scheduler.service';
import { ApiExcludeController } from '@nestjs/swagger';

// TODO: 관리자 권한 필요
@ApiExcludeController()
@Controller('scheduler')
export class SchedulerController {
  constructor(
    @Inject(TransactionCollectionScheduler)
    private readonly txScheduler: TransactionCollectionScheduler,
  ) {}

  @Post('tx-collection/start')
  async startScheduler(): Promise<boolean> {
    await this.txScheduler.setStartFlag();

    return true;
  }

  @Post('tx-collection/stop')
  async stopScheduler(): Promise<boolean> {
    await this.txScheduler.setEndFlag();

    return true;
  }
}
