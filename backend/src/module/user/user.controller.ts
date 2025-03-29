import { UserService } from './user.service';
import {
  Controller,
  HttpCode,
  Inject,
  Get,
  HttpStatus,
  Body,
  UseGuards,
  Patch,
  UseInterceptors,
  UploadedFile,
  Param,
} from '@nestjs/common';

import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { ResponsesDataDto } from 'src/dto/responses-data.dto';
import { AuthorizationToken } from 'src/constant/authorization-token';
import { AuthGuard, PublicOrAuthGuard } from '../auth/auth.guard';
import {
  ImageUploadDto,
  OtherUserProfileResponse,
  UpdateUserNameRequest,
  UpdateUserProfileTypeRequest,
  UserInfoResponse,
  UserProfileResponse,
} from './dto/user.dto';
import { ResponsesListDto } from 'src/dto/responses-list.dto';
import { UserEntity } from '../repository/entity/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/types/file-options';
import { RedisTTL } from '../cache/enum/cache.enum';
import {
  DuplicateValueError,
  LimitExceededError,
} from 'src/types/error/application-exceptions/409-conflict';
import { AuthenticatedUser } from '../auth/decorators/authenticated-user.decorator';
import { ApiDescription } from 'src/decorator/api-description.decorator';
import {
  InvalidFileNameCharatersError,
  InvalidFileNameExtensionError,
  InvalidParamsError,
} from 'src/types/error/application-exceptions/400-bad-request';
import { ContentNotFoundError } from 'src/types/error/application-exceptions/404-not-found';
import { AccessDenied } from 'src/types/error/application-exceptions/403-forbidden';
import { LoginRequired } from 'src/types/error/application-exceptions/401-unautorized';

@Controller({
  path: 'user',
})
export class UserController {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard)
  @ApiDescription({
    tags: 'User',
    summary: '유저 정보 조회',
    description: '로그인한 유저 정보 조회',
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    dataResponse: {
      status: HttpStatus.OK,
      schema: UserProfileResponse,
    },
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getUserInfo(
    @AuthenticatedUser() user: UserEntity,
  ): Promise<ResponsesDataDto<UserProfileResponse>> {
    const result = await this.userService.getUserInfo(user.id);

    return new ResponsesDataDto(result);
  }

  @ApiDescription({
    tags: 'User',
    summary: '다른 유저 정보 조회',
    description: `
    private 프로필에 비로그인 유저 접근: LOGIN_REQUIRED
    none 프로필에 로그인/비로그인 유저 접근: PROFILE_ACCESS_DENIED
    `,
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: false,
    },
    dataResponse: {
      status: HttpStatus.OK,
      schema: OtherUserProfileResponse,
    },
    exceptions: [ContentNotFoundError, AccessDenied, LoginRequired],
  })
  @UseGuards(PublicOrAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':walletAddress')
  async getOtherUserInfo(
    @Param('walletAddress') walletAddress: string,
    @AuthenticatedUser() user?: UserEntity,
  ): Promise<ResponsesDataDto<OtherUserProfileResponse>> {
    const result = await this.userService.getOtherUserInfo(
      user?.id,
      walletAddress,
    );

    return new ResponsesDataDto(result);
  }

  @UseGuards(AuthGuard)
  @ApiDescription({
    tags: 'User',
    summary: '유저 이름 변경',
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    description: `
    이미 존재하는 이름일 경우 409 ALREADY_EXISTS\n
    ${RedisTTL.EditUserName / 1000} 초가 지나기 전에 이름을 바꾸는 경우\n
    -> 409 LIMIT_EXCEEDED\n
    [이름 변경 제한] dev 서버 10분, prod 24시간
    `,
    dataResponse: {
      status: HttpStatus.OK,
      schema: UserInfoResponse,
    },
    exceptions: [DuplicateValueError, LimitExceededError],
  })
  @HttpCode(HttpStatus.OK)
  @Patch('name')
  async updateUserName(
    @AuthenticatedUser() user: UserEntity,
    @Body() dto: UpdateUserNameRequest,
  ): Promise<ResponsesDataDto<UserInfoResponse>> {
    if (!(await this.userService.canEditName(user.id))) {
      throw new LimitExceededError();
    }
    const result = await this.userService.updateUserName(user.id, dto.name);

    return new ResponsesDataDto(result);
  }

  @ApiTags('Tmp')
  @ApiDescription({
    summary: '개발용 전체 유저 목록',
  })
  @Get('list')
  async getUsers(): Promise<ResponsesListDto<UserEntity>> {
    const users = await this.userService.getUsers();

    return new ResponsesListDto(users);
  }

  @ApiDescription({
    tags: 'User',
    summary: '유저 프로필 이미지 변경',
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    dataResponse: {
      status: HttpStatus.OK,
      schema: UserInfoResponse,
    },
    exceptions: [InvalidFileNameCharatersError, InvalidFileNameExtensionError],
  })
  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ImageUploadDto, required: false })
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @HttpCode(HttpStatus.OK)
  @Patch('image')
  async updateUserImage(
    @AuthenticatedUser() user: UserEntity,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponsesDataDto<UserInfoResponse>> {
    const result = await this.userService.updateUserImage(user.id, file);

    return new ResponsesDataDto(result);
  }

  @ApiDescription({
    tags: 'User',
    summary: '유저 프로필 공개여부 설정',
    description: `
    public: 비로그인, 로그인 유저 모두 열람 가능,
    private: 로그인 유저만 열람 가능(기본값),
    none: 아무도 접근 불가
    `,
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    dataResponse: {
      status: HttpStatus.OK,
      schema: UserInfoResponse,
    },
    exceptions: [],
  })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('profileType')
  async updateUserProfileType(
    @AuthenticatedUser() user: UserEntity,
    @Body() dto: UpdateUserProfileTypeRequest,
  ): Promise<ResponsesDataDto<UserInfoResponse>> {
    const result = await this.userService.updateUserProfileType(
      user.id,
      dto.profileType,
    );

    return new ResponsesDataDto(result);
  }
}
