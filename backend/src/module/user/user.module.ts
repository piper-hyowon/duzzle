import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/module/repository/repository.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CloudStorageModule } from '../cloudStorage/cloudStorage.module';
import { PuzzleModule } from '../puzzle/puzzle.module';
import { ItemModule } from '../item/item.module';
import { SeasonHistoryModule } from '../season-history/season-history.module';
import { QuestModule } from '../quest/quest.module';

@Module({
  imports: [
    RepositoryModule,
    CloudStorageModule,
    PuzzleModule,
    ItemModule,
    SeasonHistoryModule,
    QuestModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
