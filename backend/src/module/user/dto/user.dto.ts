import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Expose, plainToInstance, Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Item } from 'src/module/item/dto/item.dto';
import { PuzzlePieces } from 'src/module/puzzle/user.puzzle.dto';
import { UserEntity } from 'src/module/repository/entity/user.entity';
import { ProfileType } from 'src/module/repository/enum/user.enum';

export class UserInfoResponse {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  image: string;

  @ApiProperty()
  @Expose()
  profileType: ProfileType;

  @ApiProperty()
  @Expose()
  level: number;

  @ApiProperty()
  @Expose()
  walletAddress: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  static from(entity: UserEntity) {
    return plainToInstance(this, entity, {
      excludeExtraneousValues: true,
    });
  }
}

export class UserNftTotals {
  @ApiProperty()
  @Expose()
  totalItems: number;

  @ApiProperty()
  @Expose()
  totalPieces: number;
}

export class UserNfts {
  @ApiProperty()
  @Expose()
  items: Item[];

  @ApiProperty()
  @Expose()
  puzzles: PuzzlePieces[];
}

export class UserRankingHistory {
  @ApiProperty({ description: '시즌 랭킹 1위' })
  @Expose()
  rankedFirst: number;

  @ApiProperty({ description: '시즌 랭킹 3위' })
  @Expose()
  rankedThird: number;

  @ApiProperty({ description: '퀘스트 연승' })
  @Expose()
  questStreak: number;
}

export class UserProfileResponse extends IntersectionType(
  UserInfoResponse,
  UserNftTotals,
) {
  @ApiProperty({ type: UserRankingHistory })
  @Expose()
  history: UserRankingHistory;
}

export class OtherUserProfileResponse extends IntersectionType(
  UserInfoResponse,
  UserNfts,
) {
  @ApiProperty({ type: UserRankingHistory })
  @Expose()
  history: UserRankingHistory;
}

export class UpdateUserNameRequest {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}

export class UpdateUserProfileTypeRequest {
  @ApiProperty({ type: 'enum', enum: ProfileType })
  @IsEnum(ProfileType)
  profileType: ProfileType;
}

export class ImageUploadDto {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  file: any;
}
