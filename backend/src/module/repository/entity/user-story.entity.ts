import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { StoryEntity } from './story.entity';

@Entity('user_story')
export class UserStoryEntity extends BaseEntity {
  @PrimaryColumn('int')
  userId: number;

  @PrimaryColumn('int')
  storyId: number;

  @Column('int')
  readPage: number;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => StoryEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'story_id' })
  story: StoryEntity;
}
