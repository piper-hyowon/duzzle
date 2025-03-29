import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {
  BlockchainNetworks,
  ContractKey,
  ContractType,
} from '../enum/contract.enum';
import { BaseEntity } from './base.entity';

@Entity('contract')
export class ContractEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('enum', { enum: BlockchainNetworks })
  network: BlockchainNetworks;

  @Column('enum', { enum: ContractType })
  type: ContractType;

  @Column('varchar')
  address: string;

  @Column('varchar')
  name: string;

  @Column('enum', { enum: ContractKey })
  key: ContractKey;

  @Column('varchar', { nullable: true })
  symbol?: string;

  @Column('varchar', { nullable: true })
  metadataBaseUri?: string;

  @Column('int')
  birthBlock: number;

  // Token 컨트랙트만 해당
  @Column('boolean', { nullable: true })
  isTokenIdAutoIncremented: boolean;
}
