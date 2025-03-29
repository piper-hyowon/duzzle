import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { SeasonZoneEntity } from './season-zone.entity';
import { MaterialItemEntity } from './material-item.entity';

@Entity('required_material_items', {
  name: 'season_zone 마다 잠금해제에 필요한 재료 아이템 ',
})
export class RequiredMaterialItemsEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  seasonZoneId: number;

  @Column('int')
  materialItemId: number;

  @Column('int')
  itemCount: number;

  @ManyToOne(() => SeasonZoneEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'season_zone_id' })
  seasonZone: SeasonZoneEntity;

  @ManyToOne(() => MaterialItemEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'material_item_id' })
  materialItem: MaterialItemEntity;
}
