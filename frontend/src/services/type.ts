import { TokenOwner } from "../pages/Mainpage/dto";

export interface ResponsesList<T> {
  result: boolean;
  data: {
    total: number;
    list: Array<T>;
  };
}

export enum NFTType {
  Material = "material",
  Blueprint = "blueprint",
  PuzzlePiece = "puzzlePiece",
}

export interface AvailableMaterialNFT {
  contractId: number;
  name: string;
  imageUrl: string;
  availableQuantity: number;
}

export interface AvailableBlueprintOrPuzzleNFT {
  seasonZoneId: number;
  seasonName: string;
  zoneName: string;
  imageUrl: string;
  availableQuantity: number;
}

export interface AvailableNftDto {
  type: NFTType;
  nftInfo: AvailableMaterialNFT | AvailableBlueprintOrPuzzleNFT;
}

export interface MaterialNFT {
  type: NFTType.Material;
  contractId: number;
  quantity: number;
}

export interface BlueprintOrPuzzleNFT {
  type: NFTType.Blueprint | NFTType.PuzzlePiece;
  seasonZoneId: number;
  quantity: number;
}

export type NFTAsset = MaterialNFT | BlueprintOrPuzzleNFT;

export type NFTCheckResult = {
  name: string;
  required: number;
  available: number;
};

export interface PostNftExchangeRequest {
  offeredNfts: NFTAsset[];
  requestedNfts: NFTAsset[];
}

export interface PaginationParams {
  count: number;
  page: number;
}

export interface NftExchangeListRequest extends PaginationParams {
  status?: string;
  requestedNfts?: string;
  offeredNfts?: string;
  offerorUser?: string;
}

export interface OfferorUserProfile {
  walletAddress?: string;
  name?: string | null;
  image?: string;
}

export interface ExchangeMaterialNFT {
  type: NFTType.Material;
  name: string;
  imageUrl?: string;
  quantity: number;
}

export interface ExchangeBlueprintOrPuzzleNFT {
  type: NFTType.Blueprint | NFTType.PuzzlePiece;
  seasonName: string;
  zoneName: string;
  imageUrl?: string | null;
  quantity: number;
}

export enum NftExchangeOfferStatus {
  LISTED = "listed", // 사용자가 제안을 등록하고 다른 사용자들이 볼 수 있는 상태
  MATCHED = "matched", // 다른 사용자가 제안을 수락했지만 아직 블록체인 트랜잭션이 시작되지 않은 상태
  PENDING = "pending", // 블록체인 트랜잭션이 시작되어 처리 중인 상태
  COMPLETED = "completed", // 교환 완료
  SYSTEM_CANCELLED = "system_cancelled", // 시스템에 의해 자동으로 취소된 상태 (해당 NFT가 이미 사용됨 or 제안자가 탈퇴한 경우)
  FAILED = "failed", // 블록체인 트랜잭션 실패로 인해 교환이 실패한 상태
}

export interface NftExchangeOfferResponse {
  id: number;
  offerorUser: OfferorUserProfile;
  offeredNfts: (ExchangeMaterialNFT | ExchangeBlueprintOrPuzzleNFT)[];
  requestedNfts: (ExchangeMaterialNFT | ExchangeBlueprintOrPuzzleNFT)[];
  status: NftExchangeOfferStatus;
  createdAt: Date;
}

export enum EventTopicName {
  Mint = "mint",
  Transfer = "transfer",
  Burn = "burn",
  StartSeason = "start_season",
  SetZoneData = "set_zone_data",
  GetRandomItem = "get_random_item",
}

export interface NftHistory {
  event: EventTopicName;

  date: Date;

  to?: string | null;
  toWalletAddress?: string | null;

  from?: string | null;

  fromWalletAddress?: string | null;

  blockExplorerUrl: string;
}

export interface NftToken {
  tokenId: number;

  history: NftHistory[];
}

export interface MaterialNftInfo extends ExchangeMaterialNFT {
  availableNfts: NftToken[];
}

export interface BlueprintOrPuzzleNftInfo extends ExchangeBlueprintOrPuzzleNFT {
  availableNfts: NftToken[];
}

export interface NftExchangeOfferDetailResponse
  extends NftExchangeOfferResponse {
  offeredNfts: (MaterialNftInfo | BlueprintOrPuzzleNftInfo)[];

  requestedNfts: (MaterialNftInfo | BlueprintOrPuzzleNftInfo)[];
}

export enum ProfileType {
  Public = "PUBLIC",
  Private = "PRIVATE",
  None = "NONE",
}

export interface OtherUserProfileResponse {
  id: number;
  email: string;
  name: string;
  image: string;
  profileType: ProfileType;
  level: number;
  walletAddress: string;
  createdAt: Date;
  items: Item[];
  puzzles: PuzzlePieces[];
  history: UserRankingHistory;
}

export interface PuzzlePieces {
  season: string;
  zone: string;
  count: number;
  image: string;
}

export interface Item {
  name: string;
  count: number;
  image: string;
}

export interface UserRankingHistory {
  rankedFirst: number;
  rankedThird: number;
  questStreak: number;
}
export interface UserPuzzleRequest extends PaginationParams {
  season?: number;
  zone?: number;
}

export interface UserPuzzleResponse {
  id: number;
  name: string;
  image: string;
  zoneUs: string;
  zoneKr: string;
  seasonUs: string;
  seasonKr: string;
  tokenId: string;
  threeDModelUrl: string;
}

export interface UserPuzzleDetailResponse {
  threeDModelUrl: string;
  zoneNameKr: string;
  zoneNameUs: string;
  season: string;
  owner: TokenOwner;
  nftThumbnailUrl: string;
  tokenId: number;
  description?: string;
  architect?: string;
}

export interface StoryProgressResponse {
  zoneId: number;
  zoneNameKr: string;
  zoneNameUs: string;
  totalStory: number;
  readStory: number;
}
