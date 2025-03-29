import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StoryEntity } from '../entity/story.entity';
import { UserStoryEntity } from '../entity/user-story.entity';
import { UpdateUserStoryDto } from '../dto/story.dto';
import { StoryContentEntity } from '../entity/story-content.entity';
import { ContentNotFoundError } from 'src/types/error/application-exceptions/404-not-found';
import { StoryProgressResponse } from 'src/module/user-story/dto/user-story.dto';

@Injectable()
export class StoryRepositoryService {
  constructor(
    @InjectRepository(StoryEntity)
    private storyRepository: Repository<StoryEntity>,

    @InjectRepository(StoryContentEntity)
    private storyContentRepository: Repository<StoryContentEntity>,

    @InjectRepository(UserStoryEntity)
    private userStoryRepository: Repository<UserStoryEntity>,
  ) {}

  async getStoryById(storyId: number): Promise<StoryContentEntity[]> {
    const story = await this.storyContentRepository.find({
      where: { story: { id: storyId } },
    });

    if (!story || story.length === 0) {
      throw new ContentNotFoundError('story', `${storyId}`);
    }

    return story;
  }

  async getStoryByPage(
    storyId: number,
    page: number,
  ): Promise<StoryContentEntity> {
    const story = await this.storyContentRepository.findOne({
      where: {
        story: { id: storyId },
        page: page,
      },
      relations: ['story', 'story.contents'],
    });

    if (!story) {
      throw new ContentNotFoundError('story:page', `${storyId}:${page}`);
    }

    return story;
  }

  async findStoryListByZone(zoneId: number): Promise<StoryEntity[]> {
    const stories = await this.storyRepository.find({
      where: { zoneId },
      relations: ['contents'],
    });

    return stories;
  }

  async findStoryProgress(userId: number): Promise<UserStoryEntity[]> {
    const userStories = await this.userStoryRepository.find({
      where: { userId },
      relations: ['story'],
    });

    return userStories;
  }

  async updateStoryProgress(dto: UpdateUserStoryDto): Promise<void> {
    const userStory = this.userStoryRepository.create({
      userId: dto.userId,
      storyId: dto.storyId,
      readPage: dto.readPage,
    });

    await this.userStoryRepository.save(userStory);
  }

  async getStoryListForGuest(): Promise<StoryProgressResponse[]> {
    const results = await this.storyRepository
      .createQueryBuilder('s')
      .select('z.id as "zoneId"')
      .addSelect('count(*) as "totalStory"')
      .addSelect('z.nameKr as "zoneNameKr"')
      .addSelect('z.nameUs as "zoneNameUs"')
      .innerJoin('s.contents', 'sc')
      .innerJoin('s.zone', 'z')
      .groupBy('z.id')
      .addGroupBy('z.nameKr')
      .addGroupBy('z.nameUs')
      .orderBy('z.id')
      .getRawMany();

    return results.map((result) => {
      return {
        zoneId: result.zoneId,
        totalStory: result.totalStory,
        zoneNameKr: result.zoneNameKr,
        zoneNameUs: result.zoneNameUs,
        readStory: 0,
      };
    });
  }
}
