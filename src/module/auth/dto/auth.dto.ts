import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';
import { UserEntity } from 'src/module/repository/entity/user.entity';
import { LoginType } from 'src/module/repository/enum/user.enum';

export class UserDto {
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
  level: number;

  @ApiProperty()
  @Expose()
  walletAddress: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  static from(entity: UserEntity): UserDto {
    return plainToInstance(UserDto, entity, {
      excludeExtraneousValues: true,
    });
  }
}

export class LoginRequest {
  @ApiProperty({ type: 'enum', enum: LoginType })
  @IsEnum(LoginType)
  loginType: LoginType;

  @ApiProperty()
  @IsEthereumAddress()
  walletAddress: string;
}

export class LoginResponse {
  @ApiProperty({ description: 'expires in 1d', nullable: true })
  accessToken: string;

  @ApiProperty({ description: 'expires in 30d', nullable: true })
  refreshToken: string;

  @ApiProperty()
  user: UserDto;
}

export class LoginJwtPayload {
  @IsPositive()
  @IsNotEmpty()
  @Expose()
  id: number;

  @IsEthereumAddress()
  @IsNotEmpty()
  @Expose()
  walletAddress: string;
}
export class JWT {
  @ApiProperty()
  @IsString()
  @IsDefined()
  accessToken: string;

  @ApiProperty()
  @IsString()
  @IsDefined()
  refreshToken: string;
}

export class RefreshTokenPayload {
  sub: number;
  refreshTokenId: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
