export type PieceDto = {
  zoneNameKr: string;
  zoneNameUs: string;
  pieceId: number;
  coordinates: string;
  minted: boolean;
  data: Minted | Unminted;
};

export type Minted = {
  season: string;
  owner: { name: string; walletAddress: string };
  nftThumbnailUrl: string;
  threeDModelUrl: string;
  tokenId: number;
  description?: string;
  architect?: string;
};

export type Unminted = {
  requiredItems: RequiredItem[];
};

export type RequiredItem = {
  name: string;
  image: string;
  count: number;
};
