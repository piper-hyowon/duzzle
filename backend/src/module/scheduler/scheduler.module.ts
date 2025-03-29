import { Module } from '@nestjs/common';
import { RepositoryModule } from '../repository/repository.module';
import { TransactionCollectionScheduler } from './transaction-collection.scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { CacheModule } from '../cache/cache.module';
import { SchedulerController } from './scheduler.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    RepositoryModule,
    BlockchainModule,
    CacheModule,
  ],
  providers: [TransactionCollectionScheduler],
  controllers: [SchedulerController],
})
export class SchedulerModule {}
