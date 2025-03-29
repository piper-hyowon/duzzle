import { NFTType } from './enums/nft-type.enum';

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
export { NFTType };

export type NFTCheckResult = {
  name: string;
  required: number;
  available: number;
};
