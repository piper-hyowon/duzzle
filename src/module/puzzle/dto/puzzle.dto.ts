import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Expose, plainToInstance, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { BLUEPRINT_ITEM_IMAGE_URL } from 'src/constant/item';
import {
  Point,
  PuzzlePieceEntity,
} from 'src/module/repository/entity/puzzle-piece.entity';
import { RequiredMaterialItemsEntity } from 'src/module/repository/entity/required-material-items.entity';

export const NON_MEMBER_USER_NAME = 'Unknown';
export const OFFSET_PUZZLE_PIECE_ID = 41;
export class RequiredItem {
  @ApiProperty({ description: '아이템 이름' })
  @Expose()
  name: string;

  @ApiProperty({ description: '아이템 이미지 URL' })
  @Expose()
  image: string;

  @ApiProperty({ description: '아이템 수' })
  @Expose()
  count: number;

  static from(entity: RequiredMaterialItemsEntity) {
    return plainToInstance(this, {
      name: entity.materialItem.nameKr,
      image: entity.materialItem.imageUrl,
      count: entity.itemCount,
    });
  }
}

export class Unminted {
  @ApiProperty({
    type: RequiredItem,
    isArray: true,
    description: '잠금해제에 필요한 아이템',
  })
  @Expose()
  @Type(() => RequiredItem)
  requiredItems: RequiredItem[];

  static from(entity: PuzzlePieceEntity) {
    return plainToInstance(this, {
      requiredItems: entity.seasonZone.requiredMaterialItems
        .map((e) => RequiredItem.from(e))
        .concat({
          name: `설계도면(${entity.seasonZone.zone.nameKr})`,
          image: BLUEPRINT_ITEM_IMAGE_URL,
          count: 1,
        }),
    });
  }
}

export class TokenOwner {
  @ApiProperty({ description: '토큰 보유 유저 이름' })
  @Expose()
  name: string;

  @ApiProperty({ description: '토큰 보유 유저 지갑 주소' })
  @Expose()
  walletAddress: string;
}

export class Minted {
  @ApiProperty({ description: '시즌 타이틀' })
  @Expose()
  season: string;

  @ApiProperty({ type: TokenOwner, description: '토큰을 소유한 유저 정보' })
  @Expose()
  @Type(() => TokenOwner)
  owner: TokenOwner;

  @ApiProperty({ description: '토큰 아이디' })
  @Expose()
  tokenId: number;

  @ApiProperty({ description: 'NFT 썸네일 이미지 URL' })
  @Expose()
  nftThumbnailUrl: String;

  @ApiProperty()
  @Expose()
  threeDModelUrl: String;

  @ApiProperty()
  @Expose()
  description?: string;

  @ApiProperty({ description: '건축가', nullable: true })
  @Expose()
  architect?: string;

  static from(entity: PuzzlePieceEntity) {
    return plainToInstance(
      this,
      {
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
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}

@ApiExtraModels(Minted, Unminted)
export class PuzzlePieceDto {
  @ApiProperty({ description: '구역 ID' })
  @Expose()
  zoneId: number;

  @ApiProperty()
  @Expose()
  zoneNameKr: string;

  @ApiProperty()
  @Expose()
  zoneNameUs: string;

  @ApiProperty({ description: '퍼즐 조각 아이디' })
  @Expose()
  pieceId: number;

  @ApiProperty({ type: Point, description: '퍼즐 조각 좌표 목록' })
  @Expose()
  coordinates: string;

  @ApiProperty({ description: 'minted=이미 민트됨(잠금해제 완료)' })
  @Expose()
  minted: boolean;

  @ApiProperty({
    description:
      '잠금해제된 퍼즐조각의 경우 "발행된 NFT와 소유 유저 정보"\n\
    그 외: "잠금해제에 필요한 아이템 정보"',
    oneOf: [
      {
        $ref: getSchemaPath(Minted),
      },
      {
        $ref: getSchemaPath(Unminted),
      },
    ],
  })
  @Expose()
  data: Minted | Unminted;

  static from(entity: PuzzlePieceEntity) {
    const data = entity.minted ? Minted.from(entity) : Unminted.from(entity);

    return plainToInstance(
      this,
      {
        ...entity,
        zoneId: entity.seasonZone.zoneId,
        pieceId: entity.id - OFFSET_PUZZLE_PIECE_ID, // TODO: 시즌별 offset 적용 필요함(or puzzle_piece 테이블에 piece_id 따로 추가)
        zoneNameKr: entity.seasonZone.zone.nameKr,
        zoneNameUs: entity.seasonZone.zone.nameUs,
        data,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}

export class PuzzleResponse {
  @ApiProperty({ description: '총 퍼즐 조각 수' })
  total: number;

  @ApiProperty({ description: '민트된 퍼즐 조각 수' })
  minted: number;

  @ApiProperty({ type: PuzzlePieceDto, isArray: true })
  pieces: PuzzlePieceDto[];
}

export class PuzzleRequest {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  seasonId: number;
}
