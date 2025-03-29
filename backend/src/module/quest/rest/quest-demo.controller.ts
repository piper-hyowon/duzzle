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
import { QuestService } from '../quest.service';
import {
  DeleteLogByType,
  StartRandomQuestResponse,
} from './dto/quest.dto';
import { QuestType } from 'src/module/repository/enum/quest.enum';

@Controller({
  path: 'quest/demo',
})
export class QuestDemoController {
  constructor(
    @Inject(REQUEST)
    private req: Request,

    @Inject(QuestService)
    private readonly questService: QuestService,
  ) {}

  @ApiTags('퀘스트(데모 영상용)')
  @ApiOperation({
    summary: '퀘스트 시작하기(덕새점프만 나옴)',
  })
  @Post('duksae-jump/start')
  async startRandomQuest1(): Promise<
    ResponsesDataDto<StartRandomQuestResponse>
  > {
    const quest = await this.questService.getQuestByTypeForDemo(
      {
        ipAddress: this.req.ip,
        userAgent: this.req.headers['user-agent'],
      },
      QuestType.DuksaeJump,
    );

    return new ResponsesDataDto(quest);
  }

  @ApiTags('퀘스트(데모 영상용)')
  @ApiOperation({
    summary: '퀘스트 시작하기(그림 퀴즈 나옴)',
  })
  @Post('picture-quiz/start')
  async startPictureQuiz(): Promise<
    ResponsesDataDto<StartRandomQuestResponse>
  > {
    const quest = await this.questService.getQuestByTypeForDemo(
      {
        ipAddress: this.req.ip,
        userAgent: this.req.headers['user-agent'],
      },
      QuestType.PictureQuiz,
    );

    return new ResponsesDataDto(quest);
  }

  @ApiTags('퀘스트(데모 영상용)')
  @ApiOperation({
    summary: '퀘스트 시작하기(음악 퀴즈만 나옴)',
  })
  @Post('music-quiz/start')
  async startMusicQuiz(): Promise<ResponsesDataDto<StartRandomQuestResponse>> {
    const quest = await this.questService.getQuestByTypeForDemo(
      {
        ipAddress: this.req.ip,
        userAgent: this.req.headers['user-agent'],
      },
      QuestType.MusicQuiz,
    );

    return new ResponsesDataDto(quest);
  }

  @ApiTags('퀘스트(데모 영상용)')
  @ApiOperation({
    summary: '퀘스트 시작하기(산성비만 나옴)',
  })
  @Post('acidrain/start')
  async startAcidRain(): Promise<ResponsesDataDto<StartRandomQuestResponse>> {
    const quest = await this.questService.getQuestByTypeForDemo(
      {
        ipAddress: this.req.ip,
        userAgent: this.req.headers['user-agent'],
      },
      QuestType.AcidRain,
    );

    return new ResponsesDataDto(quest);
  }

  @ApiTags('퀘스트(데모 영상용)')
  @ApiOperation({
    summary: '퀘스트 시작하기(스피드 퀴즈만 나옴)',
  })
  @Post('speed-quiz/start')
  async startSpeedQuiz(): Promise<ResponsesDataDto<StartRandomQuestResponse>> {
    const quest = await this.questService.getQuestByTypeForDemo(
      {
        ipAddress: this.req.ip,
        userAgent: this.req.headers['user-agent'],
      },
      QuestType.SpeedQuiz,
    );

    return new ResponsesDataDto(quest);
  }

  // 시연용 API
  // 특정 퀘스트 유형 로그 삭제하기
  @ApiTags('시연용')
  @ApiOperation({
    summary: '특정 퀘스트 유형 로그 삭제하기',
    description: `${Object.values(QuestType).join('\n\n')} \t 중 하나 이상 선택해서 삭제\n
    (API 만든 이유: 완료한 퀘스트는 다시 등장하지 않음- 시연에서 불편함)
    (예시)
    - 덕새점프, 음악퀴즈만 나오게 하려면 
    'ACID_RAIN', 'SPEED_QUIZ', 'PICTURE_QUIZ' 
    를 선택해서 삭제하면 됨`,
  })
  @Post('delete-log')
  @HttpCode(HttpStatus.OK)
  async deleteLogByType(@Body() body: DeleteLogByType): Promise<boolean> {
    await this.questService.deleteLogByType(body.walletAddress, body.types);

    return true;
  }
}
