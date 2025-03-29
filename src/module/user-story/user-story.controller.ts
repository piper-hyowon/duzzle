import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserStoryService } from './user-story.service';
import { ApiDescription } from 'src/decorator/api-description.decorator';
import { AuthorizationToken } from 'src/constant/authorization-token';
import { AuthGuard } from '../auth/auth.guard';
import {
  StoryProgressByZoneResponse,
  StoryProgressResponse,
  UpdateStoryProgressRequest,
} from './dto/user-story.dto';
import { AuthenticatedUser } from '../auth/decorators/authenticated-user.decorator';
import { UserEntity } from '../repository/entity/user.entity';
import { ResponsesListDto } from 'src/dto/responses-list.dto';
import { InvalidParamsError } from 'src/types/error/application-exceptions/400-bad-request';
import { ContentNotFoundError } from 'src/types/error/application-exceptions/404-not-found';
import { ResponsesDataDto } from 'src/dto/responses-data.dto';

@Controller({
  path: 'story',
})
export class UserStoryController {
  constructor(
    @Inject(UserStoryService)
    private readonly userStoryService: UserStoryService,
  ) {}

  @UseGuards(AuthGuard)
  @ApiDescription({
    tags: 'Story',
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    summary: '유저 구역별 스토리 진행도 조회',
    listResponse: {
      status: HttpStatus.OK,
      schema: StoryProgressResponse,
    },
  })
  @HttpCode(HttpStatus.OK)
  @Get('/progress')
  async getStoryProgress(
    @AuthenticatedUser() user: UserEntity,
  ): Promise<ResponsesListDto<StoryProgressResponse>> {
    const result = await this.userStoryService.getStoryProgress(user.id);

    return new ResponsesListDto(result);
  }

  @UseGuards(AuthGuard)
  @ApiDescription({
    tags: 'Story',
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    summary: '유저 특정 구역 스토리 진행도 조회',
    listResponse: {
      status: HttpStatus.OK,
      schema: StoryProgressByZoneResponse,
    },
  })
  @HttpCode(HttpStatus.OK)
  @Get('/progress/:zoneId')
  async getStoryProgressByZone(
    @AuthenticatedUser() user: UserEntity,
    @Param('zoneId') zoneId: number,
  ): Promise<ResponsesListDto<StoryProgressByZoneResponse>> {
    const result = await this.userStoryService.getStoryProgressByZone(
      user.id,
      zoneId,
    );

    return new ResponsesListDto(result);
  }

  @UseGuards(AuthGuard)
  @ApiDescription({
    tags: 'Story',
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    summary: '유저 스토리별 진행도 수정',
    dataResponse: {
      status: HttpStatus.OK,
      schema: true,
    },
    exceptions: [InvalidParamsError, ContentNotFoundError],
  })
  @HttpCode(HttpStatus.OK)
  @Patch('progress')
  async updateUserStoryProgress(
    @AuthenticatedUser() user: UserEntity,
    @Body() dto: UpdateStoryProgressRequest,
  ): Promise<ResponsesDataDto<boolean>> {
    await this.userStoryService.updateStoryProgress(user.id, dto);

    return new ResponsesDataDto(true);
  }
}
