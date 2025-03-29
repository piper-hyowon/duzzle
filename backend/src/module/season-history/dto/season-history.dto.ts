import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

import { Minted } from 'src/module/puzzle/dto/puzzle.dto';
import {
  Point,
  PuzzlePieceEntity,
} from 'src/module/repository/entity/puzzle-piece.entity';

export class SeasonHistoryBaseRequest {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  readonly seasonId: number;
}

export class SeasonHistoryResponse {
  @ApiProperty()
  @Expose()
  readonly id: number;

  @ApiProperty()
  @Expose()
  readonly title: number;

  @ApiProperty()
  @Expose()
  readonly thumbnailUrl: string;

  @ApiProperty()
  @Expose()
  readonly totalPieces: number;

  @ApiProperty()
  @Expose()
  readonly mintedPieces: number;
}

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

  @ApiProperty()
  @Expose()
  data: Minted | null;

  static from(entity: PuzzlePieceEntity) {
    const data = entity.minted ? Minted.from(entity) : null;

    return plainToInstance(
      this,
      {
        ...entity,
        zoneId: entity.seasonZone.zoneId,
        pieceId: entity.id, // TODO: offset 적용 필요할 예정(현재는 시즌 히스토리가 3밖에 없고, 그. 시즌3이 DB에서 첫 시즌이어서 괜찮은 것)
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

export class PuzzleHistoryResponse {
  @ApiProperty({ description: '총 퍼즐 조각 수' })
  @Expose()
  readonly total: number;

  @ApiProperty({ description: '민트된 퍼즐 조각 수' })
  @Expose()
  readonly minted: number;

  @ApiProperty({ type: PuzzlePieceDto, isArray: true })
  @Expose()
  readonly pieces: PuzzlePieceDto[];
}
