import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { NftExchangeOfferStatus } from 'src/module/repository/enum/nft-exchange-status.enum';
import { NFTType } from '../domain/nft-asset';

export class OfferorUserProfile {
  @ApiProperty({ required: false })
  @IsOptional()
  @Expose()
  walletAddress?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Expose()
  name?: string | null = null;

  @ApiProperty({ required: false })
  @IsOptional()
  @Expose()
  image?: string;
}

export class ExchangeMaterialNFT {
  @ApiProperty({ enum: [NFTType.Material] })
  @Expose()
  @IsEnum(NFTType)
  type: NFTType.Material = NFTType.Material;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  imageUrl?: string;

  @ApiProperty()
  @Expose()
  quantity: number;
}

export class ExchangeBlueprintOrPuzzleNFT {
  @ApiProperty({ enum: [NFTType.Blueprint, NFTType.PuzzlePiece] })
  @IsEnum(NFTType)
  @Expose()
  type: NFTType.Blueprint | NFTType.PuzzlePiece;

  @ApiProperty()
  @Expose()
  seasonName: string;

  @ApiProperty()
  @Expose()
  zoneName: string;

  @ApiProperty()
  @Expose()
  imageUrl?: string | null = null;

  @ApiProperty()
  @Expose()
  quantity: number;
}

@ApiExtraModels(
  OfferorUserProfile,
  ExchangeMaterialNFT,
  ExchangeBlueprintOrPuzzleNFT,
)
export class NftExchangeOfferResponse {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  offerorUser: OfferorUserProfile;

  @ApiProperty({
    oneOf: [
      { type: 'object', $ref: getSchemaPath(ExchangeMaterialNFT) },
      { type: 'object', $ref: getSchemaPath(ExchangeBlueprintOrPuzzleNFT) },
    ],
  })
  @Expose()
  offeredNfts: (ExchangeMaterialNFT | ExchangeBlueprintOrPuzzleNFT)[];

  @ApiProperty({
    oneOf: [
      { type: 'object', $ref: getSchemaPath(ExchangeMaterialNFT) },
      { type: 'object', $ref: getSchemaPath(ExchangeBlueprintOrPuzzleNFT) },
    ],
  })
  @Expose()
  requestedNfts: (ExchangeMaterialNFT | ExchangeBlueprintOrPuzzleNFT)[];

  @ApiProperty({ type: 'enum', enum: NftExchangeOfferStatus })
  @Expose()
  @IsEnum(NftExchangeOfferStatus)
  status: NftExchangeOfferStatus;

  @ApiProperty()
  @Expose()
  createdAt: Date;
}
