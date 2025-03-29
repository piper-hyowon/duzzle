import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { QuestType } from '../enum/quest.enum';
import { BaseEntity } from './base.entity';

@Entity('quest')
export class QuestEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('enum', { enum: QuestType })
  type: QuestType;

  @Column('varchar')
  quest: string;

  @Column('varchar', { nullable: true })
  answer: string;

  @Column('int')
  timeLimit: number; // 초 단위
}
