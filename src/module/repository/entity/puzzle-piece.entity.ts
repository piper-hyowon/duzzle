import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { BaseEntity } from './base.entity';
import { SeasonZoneEntity } from './season-zone.entity';
import { NftMetadataEntity } from './nft-metadata.entity';
import { Expose } from 'class-transformer';

export class Point {
  @ApiProperty()
  @Expose()
  x: number;

  @ApiProperty()
  @Expose()
  y: number;
}

@Entity('puzzle_piece', {
  comment: 'season_zone 의 모든 퍼즐 조각 목록, 조각의 민트 여부와 NFT 소유자',
})
export class PuzzlePieceEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  seasonZoneId: number;

  // 토큰 보유자가 더즐 유저일 경우, user 테이블의 name 값
  // 아닐 경우 null
  @Column('varchar', { nullable: true })
  holderName?: string;

  // 토큰 보유 지갑 주소
  @Column('varchar', { nullable: true })
  holerWalletAddress?: string;

  @Column('int', { nullable: true })
  nftMetadataId?: number;

  @Column('varchar', { nullable: true })
  coordinates: string;

  @Column('boolean', { default: false })
  minted: boolean;

  @ManyToOne(() => SeasonZoneEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'season_zone_id' })
  seasonZone: SeasonZoneEntity;

  @OneToOne(() => NftMetadataEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'nft_metadata_id' })
  metadata: NftMetadataEntity;
}
