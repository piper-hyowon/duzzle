export interface PuzzlePieceDto {
  zoneId: number;
  zoneNameKr: string;
  zoneNameUs: string;
  pieceId: number;
  coordinates: string;
  minted: boolean;
  data: Minted | Unminted;
}

export interface RequiredItem {
  name: string;
  image: string;
  count: number;
}
export interface TokenOwner {
  name: string;
  walletAddress: string;
}

export interface Minted {
  season: string;
  owner: TokenOwner;
  tokenId: number;
  nftThumbnailUrl: string;
  threeDModelUrl: string;
  description?: string;
  architect?: string;
}

export interface Unminted {
  requiredItems: RequiredItem[];
}
