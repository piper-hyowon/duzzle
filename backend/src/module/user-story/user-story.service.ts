import { Injectable } from '@nestjs/common';
import { StoryRepositoryService } from '../repository/service/story.repository.service';
import { ZoneRepositoryService } from '../repository/service/zone.repository.service';
import { InvalidParamsError } from 'src/types/error/application-exceptions/400-bad-request';
import {
  StoryProgressByZoneResponse,
  StoryProgressResponse,
  UpdateStoryProgressRequest,
} from './dto/user-story.dto';

@Injectable()
export class UserStoryService {
  constructor(
    private readonly storyRepositoryService: StoryRepositoryService,
    private readonly zoneRepositoryService: ZoneRepositoryService,
  ) {}

  async getStoryProgress(userId: number): Promise<StoryProgressResponse[]> {
    const userStories =
      await this.storyRepositoryService.findStoryProgress(userId);
    const userStoryMap = new Map<number, number>();
    userStories.forEach((userStory) =>
      userStoryMap.set(userStory.storyId, userStory.readPage),
    );

    const zones = await this.zoneRepositoryService.getZones();

    const result = await Promise.all(
      zones.map(async (zone) => {
        const stories = await this.storyRepositoryService.findStoryListByZone(
          zone.id,
        );
        if (stories.length === 0) return undefined;

        const totalStory = stories.length;
        const readStory = stories.filter((story) => {
          const readPage = userStoryMap.get(story.id);
          return readPage && readPage === story.contents.length;
        }).length;

        return {
          zoneId: zone.id,
          zoneNameKr: zone.nameKr,
          zoneNameUs: zone.nameUs,
          totalStory,
          readStory,
        };
      }),
    );

    return result.filter((item) => item !== undefined);
  }

  async getStoryProgressByZone(
    userId: number,
    zoneId: number,
  ): Promise<StoryProgressByZoneResponse[]> {
    const userStories =
      await this.storyRepositoryService.findStoryProgress(userId);
    const userStoryMap = new Map<number, number>();
    userStories.forEach((userStory) =>
      userStoryMap.set(userStory.storyId, userStory.readPage),
    );

    const stories =
      await this.storyRepositoryService.findStoryListByZone(zoneId);

    return stories.map((story) => {
      const totalPage = story.contents.length;
      const readPage = userStoryMap.get(story.id) || 0;

      return {
        storyId: story.id,
        title: story.title,
        totalPage,
        readPage,
      };
    });
  }

  async updateStoryProgress(
    userId: number,
    params: UpdateStoryProgressRequest,
  ): Promise<void> {
    const totalPage = (
      await this.storyRepositoryService.getStoryById(params.storyId)
    ).length;

    if (params.readPage > totalPage) throw new InvalidParamsError();

    await this.storyRepositoryService.updateStoryProgress({
      ...params,
      userId: userId,
    });
  }
}
