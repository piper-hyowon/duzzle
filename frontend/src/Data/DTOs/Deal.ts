export enum NftExchangeOfferStatus {
  LISTED = "listed", // 사용자가 제안을 등록하고 다른 사용자들이 볼 수 있는 상태
  MATCHED = "matched", // 다른 사용자가 제안을 수락했지만 아직 블록체인 트랜잭션이 시작되지 않은 상태
  PENDING = "pending", // 블록체인 트랜잭션이 시작되어 처리 중인 상태
  COMPLETED = "completed", // 교환 완료
  SYSTEM_CANCELLED = "system_cancelled", // 시스템에 의해 자동으로 취소된 상태 (해당 NFT가 이미 사용됨 or 제안자가 탈퇴한 경우)
  FAILED = "failed", // 블록체인 트랜잭션 실패로 인해 교환이 실패한 상태
}

export interface OfferorUserProfile {
  walletAddress: string;
  name: string;
  image: string;
}

export interface NftHistory {
  event: string;
  date: string;
  toWalletAddress: string;
  fromWalletAddress: string;
  blockExplorerUrl: string;
}

export interface AvailableNft {
  tokenId: number;
  history: NftHistory[];
}

export interface ExchangeMaterialNFT {
  contractId: number;
  name?: string;
  image?: string;
  quantity: number;
  availableNfts?: AvailableNft[];
}

export class ExchangeBlueprintOrPuzzleNFT {
  seasonZoneId: number;
  seasonName?: string;
  zoneName?: string;
  image?: string;
  quantity: number;
  availableNfts?: AvailableNft[];
}

export interface Deal {
  id: number;
  offerorUser: OfferorUserProfile;
  offeredNfts: (ExchangeMaterialNFT | ExchangeBlueprintOrPuzzleNFT)[];
  requestedNfts: (ExchangeMaterialNFT | ExchangeBlueprintOrPuzzleNFT)[];
  status: NftExchangeOfferStatus;
  createdAt: Date;
}
