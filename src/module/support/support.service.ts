import { ConfigService } from './../config/config.service';
import { Injectable } from '@nestjs/common';

import { SupportRepositoryService } from '../repository/service/support.repository.service';
import {
  FaqResponse,
  PostQuestionRequest,
  QnaResponse,
} from './dto/support.dto';
import { ReportProvider } from 'src/provider/report.provider';

@Injectable()
export class SupportService {
  constructor(
    private readonly supportRepositoryService: SupportRepositoryService,
    private readonly configService: ConfigService
  ) {}

  async getFaqs(): Promise<FaqResponse[]> {
    const faqs = await this.supportRepositoryService.getFaqList();
    const result = faqs.map((e) => FaqResponse.from(e));

    return result;
  }

  async postQuestion(
    userId: number,
    params: PostQuestionRequest,
  ): Promise<void> {
    const { category, email, question } = params;
    await this.supportRepositoryService.postQuestion({
      userId,
      category,
      email,
      question,
    });

    ReportProvider.info('1:1 문의 등록', {
      userId,
      category,
      email,
      question,
    }, SupportService.name, 
    this.configService.get('DISCORD_WEBHOOK_URL_SUPPORT'));
  }

  async updateQuestion(
    userId: number,
    questionId: number,
    params: PostQuestionRequest,
  ): Promise<void> {
    await this.supportRepositoryService.getQuestionById(userId, questionId);

    const postQuestion = {
      ...params,
      userId: userId,
    };
    await this.supportRepositoryService.updateQuestion(
      questionId,
      postQuestion,
    );
  }

  async deleteQuestion(userId: number, questionId: number): Promise<void> {
    await this.supportRepositoryService.getQuestionById(userId, questionId);

    await this.supportRepositoryService.deleteQuestion(questionId);
  }

  async getQnasByUserId(userId: number): Promise<QnaResponse[]> {
    const qnas = await this.supportRepositoryService.getQnaList(userId);
    const result = qnas.map((e) => QnaResponse.from(e));

    return result;
  }

  async getQnaById(userId: number, id: number): Promise<QnaResponse> {
    const qna = await this.supportRepositoryService.getQuestionById(userId, id);

    return QnaResponse.from(qna);
  }
}
