import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type, plainToInstance } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { StoryContentEntity } from 'src/module/repository/entity/story-content.entity';

export class StoryRequest {
  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  storyId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  page?: number = 1;
}

export class StoryResponse {
  @ApiProperty()
  @Expose()
  storyId: number;

  @ApiProperty()
  @Expose()
  currentPage: number;

  @ApiProperty()
  @Expose()
  totalPage: number;

  @ApiProperty()
  @Expose()
  content: string;

  @ApiProperty({ nullable: true })
  @Expose()
  image: string;

  @ApiProperty({ nullable: true })
  @Expose()
  audio: string;

  static from(entity: StoryContentEntity) {
    return plainToInstance(
      this,
      {
        ...entity,
        storyId: entity.story.id,
        currentPage: entity.page,
        totalPage: entity.story.contents.length,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
