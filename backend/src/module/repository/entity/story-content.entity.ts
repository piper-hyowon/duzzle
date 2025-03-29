import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { StoryEntity } from './story.entity';

@Entity('story_content')
export class StoryContentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  page: number;

  @Column('varchar', { nullable: true })
  content: string;

  @Column('varchar', { nullable: true })
  image?: string;

  @Column('varchar', { nullable: true })
  audio?: string;

  @ManyToOne(() => StoryEntity, (story) => story.contents, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  story: StoryEntity;
}
