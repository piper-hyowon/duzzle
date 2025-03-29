import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OpenseaStandardMetadata } from 'src/module/metadata/dto/metadata.dto';
import { BaseEntity } from './base.entity';
import { ContractEntity } from './contract.entity';

@Entity('nft_metadata', {
  comment:
    'NFT메타데이터, 퍼즐조각, 설계도면 NFT 는 발행될 모든 토큰의 metadata 가 유일하고,\
  아이템 NFT 는 똑같음',
})
export class NftMetadataEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  contractId: number;

  @Column('int')
  tokenId: number;

  @Column('jsonb', { nullable: true })
  metadata: OpenseaStandardMetadata;

  @ManyToOne(() => ContractEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'contract_id' })
  contract: ContractEntity;
}
