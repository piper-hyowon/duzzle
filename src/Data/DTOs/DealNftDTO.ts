export type AvailableNft = {
  type: string;
  nftInfo: MaterialNft | BlueprintOrPuzzleNft;
  quantity: number;
};

export type MaterialNft = {
  contractId: number;
  name: string;
  imageUrl: string;
  availableQuantity: number;
};

export type BlueprintOrPuzzleNft = {
  seasonZoneId: number;
  seasonName: string;
  zoneName: string;
  imageUrl: string;
  availableQuantity: number;
};
