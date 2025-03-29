import {
  Controller,
  HttpCode,
  Inject,
  Post,
  HttpStatus,
  Body,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';

import { ResponsesDataDto } from 'src/dto/responses-data.dto';
import { AuthorizationToken } from 'src/constant/authorization-token';
import { QuestService } from '../quest.service';
import { GetResultRequest, StartRandomQuestResponse } from './dto/quest.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { StartQuestInterceptor } from './quest.interceptor';
import { AuthenticatedUser } from '../../auth/decorators/authenticated-user.decorator';
import { UserEntity } from '../../repository/entity/user.entity';
import { ApiDescription } from 'src/decorator/api-description.decorator';
import { LimitExceededError } from 'src/types/error/application-exceptions/409-conflict';

@Controller({
  path: 'quest',
})
export class QuestController {
  constructor(
    @Inject(QuestService)
    private readonly questService: QuestService,
  ) {}

  // TODO: quest response 암호화
  @UseInterceptors(StartQuestInterceptor)
  @UseGuards(AuthGuard)
  @ApiDescription({
    tags: 'Quest',
    summary: '랜덤 퀘스트 시작하기',
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    dataResponse: {
      status: HttpStatus.OK,
      schema: StartRandomQuestResponse,
    },
    exceptions: [LimitExceededError],
  })
  @Post('start')
  async startRandomQuest(
    @AuthenticatedUser() user: UserEntity,
  ): Promise<ResponsesDataDto<StartRandomQuestResponse>> {
    const quest = await this.questService.getRandomQuest(user.id);

    return new ResponsesDataDto(quest);
  }

  @UseGuards(AuthGuard)
  @ApiDescription({
    tags: 'Quest',
    summary: '퀘스트 결과',
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    dataResponse: {
      status: HttpStatus.OK,
      schema: true,
    },
    exceptions: [LimitExceededError],
  })
  @HttpCode(HttpStatus.OK)
  @Post('result')
  async getResult(
    @AuthenticatedUser() user: UserEntity,
    @Body() params: GetResultRequest,
  ): Promise<ResponsesDataDto<boolean>> {
    const result = await this.questService.getResult(user.id, params);

    return new ResponsesDataDto(result);
  }
}
