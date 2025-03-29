import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { SeasonEntity } from './season.entity';
import { ZoneEntity } from './zone.entity';
import { RequiredMaterialItemsEntity } from './required-material-items.entity';

@Entity('season_zone')
export class SeasonZoneEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  seasonId: number;

  @Column('int')
  zoneId: number;

  @Column('int')
  pieceCount: number;

  @Column('varchar', { nullable: true })
  puzzleThumbnailUrl: string | null;

  @ManyToOne(() => SeasonEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'season_id' })
  season: SeasonEntity;

  @ManyToOne(() => ZoneEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'zone_id' })
  zone: ZoneEntity;

  @OneToMany(
    () => RequiredMaterialItemsEntity,
    (requiredMaterialItems) => requiredMaterialItems.seasonZone,
  )
  requiredMaterialItems: RequiredMaterialItemsEntity[];
}
