import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { ZoneEntity } from './zone.entity';
import { StoryContentEntity } from './story-content.entity';

@Entity('story')
export class StoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  zoneId: number;

  @Column('varchar', { nullable: true })
  title?: string;

  @ManyToOne(() => ZoneEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'zone_id' })
  zone: ZoneEntity;

  @OneToMany(() => StoryContentEntity, (content) => content.story, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  contents: StoryContentEntity[];
}
