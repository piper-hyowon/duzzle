import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('zone')
export class ZoneEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryColumn({ type: 'int' })
  id: number;

  @ApiProperty()
  @Column('varchar')
  nameKr: string;

  @ApiProperty()
  @Column('varchar')
  nameUs: string;
}
