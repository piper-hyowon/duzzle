import { Module } from '@nestjs/common';
import { RepositoryModule } from '../repository/repository.module';
import { UserStoryService } from './user-story.service';
import { UserStoryController } from './user-story.controller';

@Module({
  imports: [RepositoryModule],
  controllers: [UserStoryController],
  providers: [UserStoryService],
  exports: [UserStoryService],
})
export class UserStoryModule {}
