import { Injectable } from '@nestjs/common';
import { StoryRepositoryService } from '../repository/service/story.repository.service';
import { StoryResponse } from './dto/story.dto';
import { StoryProgressByZoneResponse } from '../user-story/dto/user-story.dto';

@Injectable()
export class StoryService {
  constructor(
    private readonly storyRepositoryService: StoryRepositoryService,
  ) {}

  async getStoryByPage(storyId: number, page: number): Promise<StoryResponse> {
    const result = await this.storyRepositoryService.getStoryByPage(
      storyId,
      page,
    );

    return StoryResponse.from(result);
  }

  async getStoryList() {
    return this.storyRepositoryService.getStoryListForGuest();
  }

  async getStoriesByZone(
    zoneId: number,
  ): Promise<StoryProgressByZoneResponse[]> {
    const stories =
      await this.storyRepositoryService.findStoryListByZone(zoneId);

    return stories.map((story) => {
      return {
        storyId: story.id,
        title: story.title,
        totalPage: story.contents.length,
        readPage: 0,
      };
    });
  }
}
