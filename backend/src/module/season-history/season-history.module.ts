import { Module } from '@nestjs/common';

import { SeasonHistoryController } from './season-history.controller';
import { RepositoryModule } from '../repository/repository.module';
import { SeasonHistoryService } from './season-history.service';
import { RankingsModule } from '../rankings/rankings.module';

@Module({
  imports: [RepositoryModule, RankingsModule],
  controllers: [SeasonHistoryController],
  providers: [SeasonHistoryService],
  exports: [SeasonHistoryService],
})
export class SeasonHistoryModule {}
