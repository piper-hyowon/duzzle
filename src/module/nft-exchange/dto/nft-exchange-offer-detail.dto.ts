import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import {
  ExchangeBlueprintOrPuzzleNFT,
  ExchangeMaterialNFT,
  NftExchangeOfferResponse,
} from './nft-exchange-offer.dto';
import { EventTopicName } from 'src/module/repository/enum/transaction.enum';

export class NftHistory {
  @ApiProperty({ type: 'enum', enum: EventTopicName })
  @Expose()
  @IsEnum(EventTopicName)
  event: EventTopicName;

  @ApiProperty()
  @Expose()
  date: Date;

  @ApiProperty()
  @Expose()
  to?: string | null = null;

  @ApiProperty()
  @Expose()
  toWalletAddress?: string | null = null;

  @ApiProperty()
  @Expose()
  from?: string | null = null;

  @ApiProperty()
  @Expose()
  fromWalletAddress?: string | null = null;

  @ApiProperty()
  @Expose()
  blockExplorerUrl: string;
}

export class NftToken {
  @ApiProperty()
  @Expose()
  tokenId: number;

  @ApiProperty({ type: [NftHistory] })
  @Expose()
  history: NftHistory[];
}

export class MaterialNftInfo extends ExchangeMaterialNFT {
  @ApiProperty({ type: NftToken })
  @Expose()
  availableNfts: NftToken[];
}

export class BlueprintOrPuzzleNftInfo extends ExchangeBlueprintOrPuzzleNFT {
  @ApiProperty({ type: [NftToken] })
  @Expose()
  availableNfts: NftToken[];
}

@ApiExtraModels(MaterialNftInfo, BlueprintOrPuzzleNftInfo)
export class NftExchangeOfferDetailResponse extends NftExchangeOfferResponse {
  @ApiProperty({
    oneOf: [
      { type: 'object', $ref: getSchemaPath(MaterialNftInfo) },
      { type: 'object', $ref: getSchemaPath(BlueprintOrPuzzleNftInfo) },
    ],
  })
  @Expose()
  offeredNfts: (MaterialNftInfo | BlueprintOrPuzzleNftInfo)[];

  @ApiProperty({
    oneOf: [
      { type: 'object', $ref: getSchemaPath(MaterialNftInfo) },
      { type: 'object', $ref: getSchemaPath(BlueprintOrPuzzleNftInfo) },
    ],
  })
  @Expose()
  requestedNfts: (MaterialNftInfo | BlueprintOrPuzzleNftInfo)[];
}
