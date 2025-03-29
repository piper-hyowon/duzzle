import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FaqEntity } from '../entity/faq.entity';
import { QnaEntity } from '../entity/qna.entity';
import { PostQuestionDto } from '../dto/support.dto';
import { ContentNotFoundError } from 'src/types/error/application-exceptions/404-not-found';

@Injectable()
export class SupportRepositoryService {
  constructor(
    @InjectRepository(FaqEntity)
    private faqRepository: Repository<FaqEntity>,

    @InjectRepository(QnaEntity)
    private qnaRepository: Repository<QnaEntity>,
  ) {}

  async getFaqList(): Promise<FaqEntity[]> {
    const faqs = await this.faqRepository.find({
      order: {
        createdAt: 'ASC',
      },
    });

    return faqs;
  }

  async postQuestion(dto: PostQuestionDto): Promise<QnaEntity> {
    const qnaEntity = this.qnaRepository.create(dto);
    await this.qnaRepository.insert(qnaEntity);

    return qnaEntity;
  }

  async updateQuestion(
    questionId: number,
    dto: PostQuestionDto,
  ): Promise<void> {
    await this.qnaRepository.update(
      { id: questionId, userId: dto.userId },
      dto,
    );
  }

  async deleteQuestion(questionId): Promise<void> {
    await this.qnaRepository.delete(questionId);
  }

  async getQuestionById(
    userId: number,
    questionId: number,
  ): Promise<QnaEntity> {
    const question = await this.qnaRepository.findOneBy({
      id: questionId,
      userId,
    });

    if (!question) {
      throw new ContentNotFoundError('question', questionId);
    }

    return question;
  }

  async getQnaList(userId: number): Promise<QnaEntity[]> {
    const qnas = await this.qnaRepository.find({
      where: {
        userId,
      },
      order: {
        updatedAt: 'DESC',
      },
    });

    return qnas;
  }
}
