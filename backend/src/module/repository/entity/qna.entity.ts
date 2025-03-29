import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { QuestionCategory } from '../enum/support.enum';
import { BaseEntity } from './base.entity';

// TODO: 추후에 컬럼 추가
// - 답변한 관리자: answered_by
@Entity('qna')
export class QnaEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  userId: number;

  @Column('enum', { enum: QuestionCategory })
  category: QuestionCategory;

  @Column('varchar')
  question: string;

  @Column('varchar', { nullable: true })
  answer?: string;

  // 답변 받을 이메일 주소
  @Column('varchar')
  email: string;

  @Column({ nullable: true, type: 'timestamptz' })
  answeredAt: Date;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
