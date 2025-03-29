import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { EventTopicName } from '../enum/transaction.enum';

@Unique([
  'transactionHash',
  'transactionIndex',
  'topic',
  'contractAddress',
  'from',
  'to',
  'tokenId',
])
@Entity('log_transaction')
export class LogTransactionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar')
  contractAddress: string;

  @Column('varchar')
  blockHash: string;

  @Column('int')
  blockNumber: number;

  @Column('int', { nullable: true })
  transactionIndex: number;

  @Column('varchar')
  from: string;

  @Column('varchar')
  to: string;

  @Column('int', { nullable: true })
  tokenId?: number;

  @Column('enum', { enum: EventTopicName })
  topic: EventTopicName;

  @Column('int')
  @Index()
  timestamp: number;

  @Column('varchar')
  transactionHash: string;
}
