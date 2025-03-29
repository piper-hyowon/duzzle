import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import {
  BlueprintOrPuzzleNFT,
  MaterialNFT,
  NFTAsset,
  NFTType,
} from '../domain/nft-asset';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NftExchangeOfferStatus } from 'src/module/repository/enum/nft-exchange-status.enum';
import { PaginationDto } from 'src/dto/request.dto';

export class MaterialNFTDTO implements MaterialNFT {
  @ApiProperty({ enum: [NFTType.Material] })
  @IsEnum(NFTType)
  type: NFTType.Material = NFTType.Material;

  @ApiProperty()
  @IsInt()
  contractId: number;

  @ApiProperty()
  @IsInt()
  quantity: number;
}

export class BlueprintOrPuzzleNFTDTO implements BlueprintOrPuzzleNFT {
  @ApiProperty({ enum: [NFTType.Blueprint, NFTType.PuzzlePiece] })
  @IsEnum(NFTType)
  type: NFTType.Blueprint | NFTType.PuzzlePiece;

  @ApiProperty()
  @IsInt()
  seasonZoneId: number;

  @ApiProperty()
  @IsInt()
  quantity: number;
}

@ApiExtraModels(MaterialNFTDTO, BlueprintOrPuzzleNFTDTO)
export class PostNftExchangeRequest {
  @ApiProperty({
    description: '제공할 NFT 목록',
    oneOf: [
      { type: 'object', $ref: getSchemaPath(MaterialNFTDTO) },
      { type: 'object', $ref: getSchemaPath(BlueprintOrPuzzleNFTDTO) },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object, {
    discriminator: {
      property: 'type',
      subTypes: [
        { value: MaterialNFTDTO, name: NFTType.Material },
        { value: BlueprintOrPuzzleNFTDTO, name: NFTType.Blueprint },
        { value: BlueprintOrPuzzleNFTDTO, name: NFTType.PuzzlePiece },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  offeredNfts: NFTAsset[];

  @ApiProperty({
    description: '필요한 NFT 목록',
    oneOf: [
      { type: 'object', $ref: getSchemaPath(MaterialNFTDTO) },
      { type: 'object', $ref: getSchemaPath(BlueprintOrPuzzleNFTDTO) },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object, {
    discriminator: {
      property: 'type',
      subTypes: [
        { value: MaterialNFTDTO, name: NFTType.Material },
        { value: BlueprintOrPuzzleNFTDTO, name: NFTType.Blueprint },
        { value: BlueprintOrPuzzleNFTDTO, name: NFTType.PuzzlePiece },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  requestedNfts: NFTAsset[];
}

export class NftExchangeListRequest extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(NftExchangeOfferStatus)
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  requestedNfts?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  offeredNfts?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  offerorUser?: string;
}
