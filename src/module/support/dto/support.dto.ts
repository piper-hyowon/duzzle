import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { IsEmail, IsEnum, IsString, MaxLength } from 'class-validator';
import { FaqEntity } from 'src/module/repository/entity/faq.entity';
import { QnaEntity } from 'src/module/repository/entity/qna.entity';
import { QuestionCategory } from 'src/module/repository/enum/support.enum';

export class FaqResponse {
  @ApiProperty()
  @Expose()
  question: string;

  @ApiProperty()
  @Expose()
  answer: string;

  static from(entity: FaqEntity) {
    return plainToInstance(this, entity, { excludeExtraneousValues: true });
  }
}

export class PostQuestionRequest {
  @ApiProperty({ type: 'enum', enum: QuestionCategory })
  @IsEnum(QuestionCategory)
  category: QuestionCategory;

  @ApiProperty({ description: '답변 받을 이메일 주소' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '문의 내용 최대 500자' })
  @IsString()
  @MaxLength(500)
  question: string;
}

export class QnaResponse {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  category: QuestionCategory;

  @ApiProperty({ description: '문의 내용 마지막 수정 일시' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: '문의 내용' })
  @Expose()
  question: string;

  @ApiProperty({ description: '답변 받을 이메일 주소' })
  @Expose()
  email: string;

  @ApiProperty({ description: '답변 내용' })
  @Expose()
  answer: string;

  @ApiProperty({ description: '답변 상태(true = 답변완료, false = 답변대기)' })
  @Expose()
  isAnswered: boolean;

  @ApiProperty({ description: '답변 일시' })
  @Expose()
  answeredAt: Date;

  static from(entity: QnaEntity) {
    return plainToInstance(
      this,
      {
        ...entity,
        isAnswered: !!entity?.answer,
        createdAt: entity.updatedAt,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
