import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance, Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

import { PuzzlePieceEntity } from '../repository/entity/puzzle-piece.entity';
import { PaginationDto } from 'src/dto/request.dto';
import { NON_MEMBER_USER_NAME, TokenOwner } from './dto/puzzle.dto';

export class PuzzlePieces {
  @ApiProperty()
  @Expose()
  season: string;

  @ApiProperty()
  @Expose()
  zone: string;

  @ApiProperty()
  @Expose()
  @Type(() => Number)
  count: number;

  @ApiProperty()
  @Expose()
  image: string;
}

export class UserPuzzleRequest extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  season?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  zone?: number;
}

export class UserPuzzleResponse {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  image: string;

  @ApiProperty()
  @Expose()
  zoneUs: string;

  @ApiProperty()
  @Expose()
  zoneKr: string;

  @ApiProperty()
  @Expose()
  seasonUs: string;

  @ApiProperty()
  @Expose()
  seasonKr: string;

  @ApiProperty()
  @Expose()
  tokenId: string;

  @ApiProperty()
  @Expose()
  threeDModelUrl: string;

  static from(entity: PuzzlePieceEntity) {
    // zone name
    const { nameKr, nameUs } = entity.seasonZone.zone;

    // season name
    const { title, titleKr } = entity.seasonZone.season;

    return plainToInstance(
      this,
      {
        ...entity,
        name: entity.metadata.metadata.name,
        image: entity.metadata.metadata.image,
        zoneUs: nameUs,
        zoneKr: nameKr,
        tokenId: entity.metadata.tokenId,
        seasonKr: titleKr,
        seasonUs: title,
        threeDModelUrl: entity?.metadata.metadata?.attributes?.find(
          (e) => e.trait_type === 'threeDModel',
        )?.value,
      },
      { excludeExtraneousValues: true },
    );
  }
}

export class UserPuzzlePiecesResponse {
  @ApiProperty({ type: PuzzlePieces, isArray: true })
  @Type(() => PuzzlePieces)
  puzzles: PuzzlePieces[];
}

export class UserPuzzlePathParams {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  id: number;
}

export class UserPuzzleDetailResponse {
  @ApiProperty()
  @Expose()
  threeDModelUrl: string;

  @ApiProperty()
  @Expose()
  zoneNameKr: string;

  @ApiProperty()
  @Expose()
  zoneNameUs: string;

  @ApiProperty()
  @Expose()
  season: string;

  @ApiProperty()
  @Expose()
  owner: TokenOwner;

  @ApiProperty()
  @Expose()
  nftThumbnailUrl: string;

  @ApiProperty()
  @Expose()
  tokenId: number;

  @ApiProperty({ required: false })
  @Expose()
  description?: string;

  @ApiProperty({ required: false })
  @Expose()
  architect?: string;

  static from(entity: PuzzlePieceEntity) {
    return plainToInstance(
      this,
      {
        zoneNameKr: entity.seasonZone.zone.nameKr,
        zoneNameUs: entity.seasonZone.zone.nameUs,
        ...entity?.metadata,
        description: entity?.metadata.metadata?.description,
        owner: {
          name: entity.holderName ?? NON_MEMBER_USER_NAME,
          walletAddress: entity.holerWalletAddress,
        },
        season: entity.seasonZone.season.title,
        nftThumbnailUrl: entity?.metadata.metadata?.image,
        threeDModelUrl: entity?.metadata.metadata?.attributes?.find(
          (e) => e.trait_type === 'threeDModel',
        )?.value,
        architect: entity?.metadata.metadata?.attributes?.find(
          (e) => e.trait_type === 'architect',
        )?.value,
        tokenId: entity.metadata.tokenId,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
