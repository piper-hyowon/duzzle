import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { StoryService } from './story.service';
import { ResponsesDataDto } from 'src/dto/responses-data.dto';
import { StoryRequest, StoryResponse } from './dto/story.dto';
import { ApiDescription } from 'src/decorator/api-description.decorator';
import { InvalidParamsError } from 'src/types/error/application-exceptions/400-bad-request';
import { ContentNotFoundError } from 'src/types/error/application-exceptions/404-not-found';
import {
  StoryProgressByZoneResponse,
  StoryProgressResponse,
} from '../user-story/dto/user-story.dto';
import { ResponsesListDto } from 'src/dto/responses-list.dto';

@Controller({
  path: 'story',
})
export class StoryController {
  constructor(
    @Inject(StoryService)
    private readonly storyService: StoryService,
  ) {}

  @ApiDescription({
    tags: 'Story',
    summary: '스토리 특정 페이지 조회',
    description: `
    스토리 페이지는 1부터 시작\n
    0 이하 숫자 입력 시, 400 INVALID_PARAMETER
    `,
    dataResponse: {
      status: HttpStatus.OK,
      schema: StoryResponse,
    },
    exceptions: [InvalidParamsError, ContentNotFoundError],
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getStory(
    @Query() query: StoryRequest,
  ): Promise<ResponsesDataDto<StoryResponse>> {
    const { storyId, page } = query;
    const result = await this.storyService.getStoryByPage(storyId, page);

    return new ResponsesDataDto(result);
  }

  @ApiDescription({
    tags: 'Story',
    summary: '진척도 없이 스토리 목록 조회(게스트용)',
    dataResponse: {
      status: HttpStatus.OK,
      schema: StoryResponse,
    },
  })
  @HttpCode(HttpStatus.OK)
  @Get('all')
  async getStoryListForGuest(): Promise<
    ResponsesListDto<StoryProgressResponse>
  > {
    return new ResponsesListDto(await this.storyService.getStoryList());
  }

  @ApiDescription({
    tags: 'Story',
    summary: '진척도 없이 구역별 스토리 목록 조회(게스트용)',
    dataResponse: {
      status: HttpStatus.OK,
      schema: StoryResponse,
    },
  })
  @HttpCode(HttpStatus.OK)
  @Get('all/:zoneId')
  async getStoryListForGuestByZone(
    @Param('zoneId', ParseIntPipe) zoneId: number,
  ): Promise<ResponsesListDto<StoryProgressByZoneResponse>> {
    return new ResponsesListDto(
      await this.storyService.getStoriesByZone(zoneId),
    );
  }
}
