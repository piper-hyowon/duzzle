import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { ContractEntity } from './contract.entity';

@Entity('material_item', {
  comment:
    '해당 컨트랙트에서 발행되는 아이템, 최대 발행량과 이미지를 커스터마이징',
})
export class MaterialItemEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar')
  nameKr: string;

  @Column('int')
  contractId: number;

  @Column('varchar')
  imageUrl: string;

  @Column('int')
  maxSupply: number;

  @ManyToOne(() => ContractEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'contract_id' })
  contract: ContractEntity;
}
