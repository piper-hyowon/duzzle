import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { QuestEntity } from './quest.entity';
import { BaseEntity } from './base.entity';
import { GuestInfo } from 'src/module/quest/rest/types/guest';

@Index(['questId', 'userId'])
@Entity('log_quest')
export class LogQuestEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int', { nullable: true })
  questId: number;

  @Column('int', { nullable: true })
  userId?: number;

  @Column('boolean', { default: false })
  isGuestUser: boolean;

  @Column('json', { nullable: true })
  guestInfo?: GuestInfo;

  @Column('boolean', { nullable: true })
  isSucceeded: boolean;

  @Column('boolean', { nullable: true })
  rewardReceived: boolean;

  @Column('boolean', { nullable: true })
  isCompleted: boolean;

  @ManyToOne(() => UserEntity, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => QuestEntity, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'quest_id' })
  quest: QuestEntity;
}
