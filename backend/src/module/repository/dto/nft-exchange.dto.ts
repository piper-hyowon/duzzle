import { NFTAsset } from 'src/module/nft-exchange/domain/nft-asset';

export class NftExchangeOfferDto {
  offerorUserId: number;
  offeredNfts: NFTAsset[];
  requestedNfts: NFTAsset[];
}
