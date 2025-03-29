import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { NFTType } from '../domain/nft-asset';

export class AvailableMaterialNFT {
  @ApiProperty()
  contractId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  availableQuantity: number;
}

export class AvailableBlueprintOrPuzzleNFT {
  @ApiProperty()
  seasonZoneId: number;

  @ApiProperty()
  seasonName: string;

  @ApiProperty()
  zoneName: string;

  @ApiProperty({
    description: '설계도면은 모두 동일, 퍼즐 조각은 시즌/구역마다 다름',
    nullable: true,
  })
  imageUrl: string;

  @ApiProperty()
  availableQuantity: number;
}

@ApiExtraModels(AvailableMaterialNFT, AvailableBlueprintOrPuzzleNFT)
export class AvailableNftDto {
  @ApiProperty({ enum: NFTType })
  type: NFTType;

  @ApiProperty({
    oneOf: [
      { type: 'object', $ref: getSchemaPath(AvailableMaterialNFT) },
      { type: 'object', $ref: getSchemaPath(AvailableBlueprintOrPuzzleNFT) },
    ],
  })
  nftInfo: AvailableMaterialNFT | AvailableBlueprintOrPuzzleNFT;
}
