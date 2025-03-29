import { Module } from '@nestjs/common';
import { RepositoryModule } from '../repository/repository.module';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';

@Module({
  imports: [RepositoryModule],
  controllers: [StoryController],
  providers: [StoryService],
  exports: [StoryService],
})
export class StoryModule {}
