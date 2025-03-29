import {
  Controller,
  HttpCode,
  Inject,
  Get,
  HttpStatus,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
  Put,
} from '@nestjs/common';

import { AuthGuard } from 'src/module/auth/auth.guard';
import { SupportService } from './support.service';
import {
  FaqResponse,
  PostQuestionRequest,
  QnaResponse,
} from './dto/support.dto';
import { ResponsesListDto } from 'src/dto/responses-list.dto';
import { ResponsesDataDto } from 'src/dto/responses-data.dto';
import { AuthorizationToken } from 'src/constant/authorization-token';
import { AuthenticatedUser } from '../auth/decorators/authenticated-user.decorator';
import { UserEntity } from '../repository/entity/user.entity';
import { ApiDescription } from 'src/decorator/api-description.decorator';
import { ContentNotFoundError } from 'src/types/error/application-exceptions/404-not-found';

@Controller({
  path: 'support',
})
export class SupportController {
  constructor(
    @Inject(SupportService)
    private readonly supportService: SupportService,
  ) {}

  @ApiDescription({
    tags: 'Support',
    summary: '자주 묻는 질문(FAQ) 목록',
    listResponse: {
      status: HttpStatus.OK,
      schema: FaqResponse,
    },
  })
  @HttpCode(HttpStatus.OK)
  @Get('faq')
  async getFaqs(): Promise<ResponsesListDto<FaqResponse>> {
    const result = await this.supportService.getFaqs();

    return new ResponsesListDto(result);
  }

  @UseGuards(AuthGuard)
  @ApiDescription({
    tags: 'Support',
    summary: '1:1 문의 등록',
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    dataResponse: {
      status: HttpStatus.CREATED,
      schema: true,
    },
  })
  @Post('qna')
  async postQuestion(
    @AuthenticatedUser() user: UserEntity,
    @Body() dto: PostQuestionRequest,
  ): Promise<ResponsesDataDto<boolean>> {
    await this.supportService.postQuestion(user.id, dto);

    return new ResponsesDataDto(true);
  }

  @UseGuards(AuthGuard)
  @ApiDescription({
    tags: 'Support',
    summary: '1:1 문의 수정',
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    dataResponse: {
      status: HttpStatus.OK,
      schema: true,
    },
    exceptions: [ContentNotFoundError],
  })
  @HttpCode(HttpStatus.OK)
  @Put('qna/:questionId')
  async updateQuestion(
    @AuthenticatedUser() user: UserEntity,
    @Param('questionId') questionId: number,
    @Body() dto: PostQuestionRequest,
  ): Promise<ResponsesDataDto<boolean>> {
    await this.supportService.updateQuestion(user.id, questionId, dto);

    return new ResponsesDataDto(true);
  }

  @UseGuards(AuthGuard)
  @ApiDescription({
    tags: 'Support',
    summary: '1:1 문의 삭제',
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    dataResponse: {
      status: HttpStatus.OK,
      schema: true,
    },
    exceptions: [ContentNotFoundError],
  })
  @HttpCode(HttpStatus.OK)
  @Delete('qna/:questionId')
  async deleteQuestion(
    @AuthenticatedUser() user: UserEntity,
    @Param('questionId') questionId: number,
  ): Promise<ResponsesDataDto<boolean>> {
    await this.supportService.deleteQuestion(user.id, questionId);

    return new ResponsesDataDto(true);
  }

  @UseGuards(AuthGuard)
  @ApiDescription({
    tags: 'Support',
    summary: '1:1 문의 목록',
    description: '유저가 등록한 1:1 문의 목록, 마지막 수정 시간 내림차순 정렬',
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    listResponse: {
      status: HttpStatus.OK,
      schema: QnaResponse,
    },
    exceptions: [ContentNotFoundError],
  })
  @Get('qna')
  async getQnas(
    @AuthenticatedUser() user: UserEntity,
  ): Promise<ResponsesListDto<QnaResponse>> {
    const result = await this.supportService.getQnasByUserId(user.id);

    return new ResponsesListDto(result);
  }

  @UseGuards(AuthGuard)
  @ApiDescription({
    tags: 'Support',
    summary: '특정 1:1 문의 조회',
    description: '유저가 등록한 1:1 문의 목록, 마지막 수정 시간 내림차순 정렬',
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    dataResponse: {
      status: HttpStatus.OK,
      schema: QnaResponse,
    },
    exceptions: [ContentNotFoundError],
  })
  @Get('qna/:id')
  async getQnaById(
    @AuthenticatedUser() user: UserEntity,
    @Param('id') id: number,
  ): Promise<ResponsesDataDto<QnaResponse>> {
    const result = await this.supportService.getQnaById(user.id, id);

    return new ResponsesDataDto(result);
  }
}
