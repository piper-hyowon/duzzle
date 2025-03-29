import { Module } from '@nestjs/common';
import { PuzzleModule } from '../puzzle/puzzle.module';
import { RankingsController } from './rankings.controller';
import { RankingsService } from './rankings.service';

@Module({
  imports: [PuzzleModule],
  providers: [RankingsService],
  controllers: [RankingsController],
  exports: [RankingsService],
})
export class RankingsModule {}
