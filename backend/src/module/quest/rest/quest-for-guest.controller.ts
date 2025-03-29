import {
  Controller,
  HttpCode,
  Inject,
  Post,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ResponsesDataDto } from 'src/dto/responses-data.dto';
import { ResponseData } from 'src/decorator/response-data.decorator';
import { ExceptionCode } from 'src/constant/exception';
import { ResponseException } from 'src/decorator/response-exception.decorator';
import { QuestService } from '../quest.service';
import { GetResultRequest, StartRandomQuestResponse } from './dto/quest.dto';

@Controller({
  path: 'quest/guest',
})
export class QuestForGuestController {
  constructor(
    @Inject(REQUEST)
    private req: Request,

    @Inject(QuestService)
    private readonly questService: QuestService,
  ) {}

  @ApiTags('Quest(For Guest)')
  @ApiOperation({
    summary: '랜덤 퀘스트 시작하기(게스트용)',
    description:
      '의도한 에러 없음! 모든 퀘스트 목록 중 랜덤으로 반환\n\n\
      게스트를 식별하지 않기 때문에 퀘스트가 중복으로 나올 수 있음',
  })
  @ResponseData(StartRandomQuestResponse)
  @Post('start')
  async startRandomQuest(): Promise<
    ResponsesDataDto<StartRandomQuestResponse>
  > {
    const quest = await this.questService.getRandomQuestForGuest({
      ipAddress: this.req.ip,
      userAgent: this.req.headers['user-agent'],
    });

    return new ResponsesDataDto(quest);
  }

  @ApiTags('Quest(For Guest)')
  @ApiOperation({
    summary: '퀘스트 결과(게스트옹)',
    description:
      'logId 불일치/NotFound 에러 -> 400, NO_ONGOING_QUEST\n\n\
    게스트유저는 퀘스트 성공시 토큰 지급 없음',
  })
  @HttpCode(HttpStatus.OK)
  @ResponseException(HttpStatus.BAD_REQUEST, [ExceptionCode.NoOngoingQuest])
  @Post('result')
  async getResult(
    @Body() params: GetResultRequest,
  ): Promise<ResponsesDataDto<boolean>> {
    const result = await this.questService.getResult(null, params);

    return new ResponsesDataDto(result);
  }
}
