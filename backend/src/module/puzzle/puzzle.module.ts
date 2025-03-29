import { Module } from '@nestjs/common';
import { RepositoryModule } from '../repository/repository.module';
import { PuzzleService } from './puzzle.service';
import { PuzzleController } from './puzzle.controller';

@Module({
  imports: [RepositoryModule],
  controllers: [PuzzleController],
  providers: [PuzzleService],
  exports: [PuzzleService],
})
export class PuzzleModule {}
