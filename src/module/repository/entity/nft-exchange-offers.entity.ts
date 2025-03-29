import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { BaseEntity } from './base.entity';
import { NftExchangeOfferStatus } from '../enum/nft-exchange-status.enum';
import { NFTAsset } from 'src/module/nft-exchange/domain/nft-asset';
import { UserEntity } from './user.entity';

@Entity('nft_exchange_offers')
export class NftExchangeOfferEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int', { nullable: true })
  offerorUserId: number;

  @Column('enum', {
    enum: NftExchangeOfferStatus,
    default: NftExchangeOfferStatus.LISTED,
  })
  status: NftExchangeOfferStatus;

  @Column('jsonb', { comment: 'offeror 가 제공할 NFT 목록 = acceptor 에게 전송' })
  offeredNfts: NFTAsset[];

  @Column('jsonb', { comment: 'offeror 가 요청한 NFT 목록 = acceptor 가 제공' })
  requestedNfts: NFTAsset[];

  @Column('int', { nullable: true })
  acceptorUserId: number;

  @Column('varchar', { nullable: true })
  transactionHash: string | null;

  @Column('varchar', { nullable: true })
  failureReason: string | null;

  /**
   * 제안자가 탈퇴(hard-delete)한 경우
   * - 제안 상태가 LISTED인 경우, set null, status 는 system_cancelled 로 변경하기
   * - 제안 상태가 COMPLETED, SYSTEM_CANCELLED 인 경우, set null
   * - 제안 상태가 PENDING, MATCHED인 경우, 아무것도 하지 않음
   * => 탈퇴 API 에서 해당 제안자의 제안 상태를 확인하여 처리 // TODO: <-
   */
  @ManyToOne(() => UserEntity, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn({ name: 'offeror_user_id' })
  offeror: UserEntity;

  // 제안 수락자가 탈퇴(hard-delete)한 경우, 제안 유지, user_id만 null로 변경
  @ManyToOne(() => UserEntity, {
    onDelete: 'SET NULL',
    onUpdate: 'SET NULL',
  })
  @JoinColumn({ name: 'acceptor_user_id' })
  acceptor: UserEntity;
}
