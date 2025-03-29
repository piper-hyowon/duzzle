import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class StoryProgressResponse {
  @ApiProperty()
  @Expose()
  zoneId: number;

  @ApiProperty()
  @Expose()
  zoneNameKr: string;

  @ApiProperty()
  @Expose()
  zoneNameUs: string;

  @ApiProperty()
  @Expose()
  totalStory: number;

  @ApiProperty()
  @Expose()
  readStory: number;
}

export class StoryProgressByZoneResponse {
  @ApiProperty()
  @Expose()
  storyId: number;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  totalPage: number;

  @ApiProperty()
  @Expose()
  readPage: number;
}

export class UpdateStoryProgressRequest {
  @ApiProperty()
  @IsNotEmpty()
  storyId: number;

  @ApiProperty()
  @IsNotEmpty()
  readPage: number;
}
