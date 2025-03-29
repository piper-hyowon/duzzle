import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthorizationToken } from 'src/constant/authorization-token';
import { ApiDescription } from 'src/decorator/api-description.decorator';
import { NftExchangeService } from './nft-exchange.service';
import { AuthGuard } from '../auth/auth.guard';
import { AuthenticatedUser } from '../auth/decorators/authenticated-user.decorator';
import { UserEntity } from '../repository/entity/user.entity';
import { ResponsesDataDto } from 'src/dto/responses-data.dto';
import { AvailableNftsToRequestRequest } from './dto/available-nfts-to-request.dto';
import { ResponsesListDto } from 'src/dto/responses-list.dto';
import { AvailableNftDto } from './dto/available-nfts.dto';
import {
  NftExchangeListRequest,
  PostNftExchangeRequest,
} from './dto/nft-exchange.dto';
import { ContentNotFoundError } from 'src/types/error/application-exceptions/404-not-found';
import {
  AccessDenied,
  SelfAcceptForbidden,
} from 'src/types/error/application-exceptions/403-forbidden';
import { ActionNotPermittedError } from 'src/types/error/application-exceptions/409-conflict';
import {
  InsufficientNFTError,
  NFTBalanceChangedError,
} from 'src/types/error/application-exceptions/400-bad-request';
import { NftExchangeOfferResponse } from './dto/nft-exchange-offer.dto';
import { NftExchangeOfferDetailResponse } from './dto/nft-exchange-offer-detail.dto';

@Controller('nft-exchange')
export class NftExchangeController {
  constructor(private readonly nftExchangeService: NftExchangeService) {}

  @ApiDescription({
    tags: 'NFT Exchange',
    summary: '유저가 제공 가능한 NFT 목록 조회   (거래 등록 1단계에서 사용)',
    description: '페이지네이션 없이 전체 목록 조회',
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    listResponse: {
      status: HttpStatus.OK,
      schema: AvailableNftDto,
    },
  })
  @UseGuards(AuthGuard)
  @Get('available-nfts-to-offer')
  async getAvailableNftsToOffer(
    @AuthenticatedUser() user: UserEntity,
  ): Promise<ResponsesListDto<AvailableNftDto>> {
    const result = await this.nftExchangeService.getAvailableNFTsToOffer(
      user.id,
      user.walletAddress,
    );

    return new ResponsesListDto(result);
  }

  @ApiDescription({
    tags: 'NFT Exchange',
    summary: '요청 가능한 NFT 목록 조회   (거래 등록 2단계에서 사용)',
    description: '페이지네이션 있음, name(구역 or 재료명) 으로 검색 가능',
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    listResponse: {
      status: HttpStatus.OK,
      schema: AvailableNftDto,
    },
  })
  @UseGuards(AuthGuard)
  @Get('available-nfts-to-request')
  async getAvailableNftsToRequest(
    @Query() params: AvailableNftsToRequestRequest,
  ) {
    const result =
      await this.nftExchangeService.getAvailableNFTsToRequest(params);

    return new ResponsesListDto(result.list, result.total);
  }

  @ApiDescription({
    tags: 'NFT Exchange',
    summary: '교환 제안 생성   (거래 등록 3단계에서 사용)',
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    dataResponse: {
      status: HttpStatus.CREATED,
      schema: true,
    },
    exceptions: [ContentNotFoundError],
  })
  @UseGuards(AuthGuard)
  @Post('register')
  async postNftExchange(
    @AuthenticatedUser() user: UserEntity,
    @Body() dto: PostNftExchangeRequest,
  ): Promise<ResponsesDataDto<boolean>> {
    await this.nftExchangeService.postNftExchange(user.id, dto);

    return new ResponsesDataDto(true);
  }

  @ApiDescription({
    tags: 'NFT Exchange',
    summary: '교환 제안 취소',
    description: `
    교환 제안 취소 가능 상태: listed
    * listed: 사용자가 제안을 등록하고 다른 사용자들이 볼 수 있는 상태
    `,
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    dataResponse: {
      status: HttpStatus.OK,
      schema: true,
    },
    exceptions: [ContentNotFoundError, AccessDenied, ActionNotPermittedError],
  })
  @UseGuards(AuthGuard)
  @Delete('cancel/:id')
  async deleteNftExchange(
    @AuthenticatedUser() user: UserEntity,
    @Param('id') nftExchangeId: number,
  ): Promise<ResponsesDataDto<boolean>> {
    await this.nftExchangeService.deleteNftExchange(user.id, nftExchangeId);

    return new ResponsesDataDto(true);
  }

  @ApiDescription({
    tags: 'NFT Exchange',
    summary: '교환 제안 목록',
    description:
      '페이지네이션 있음, 검색 조건: 거래 상태, 제안 nft, 요청 nft, 제안자(사용자명)',
    listResponse: {
      status: HttpStatus.OK,
      schema: NftExchangeOfferResponse,
    },
  })
  @Get()
  async getNftExchangeList(@Query() params: NftExchangeListRequest) {
    const result = await this.nftExchangeService.getNftExchangeList(params);

    return new ResponsesListDto(result.list, result.total);
  }

  @ApiDescription({
    tags: 'NFT Exchange',
    summary: '내가 등록한 교환 제안 목록',
    description:
      '페이지네이션 있음, 검색 조건: 거래 상태, 제안 nft, 요청 nft, 제안자(사용자명)',
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    listResponse: {
      status: HttpStatus.OK,
      schema: NftExchangeOfferResponse,
    },
  })
  @UseGuards(AuthGuard)
  @Get('my')
  async getMyNftExchangeList(
    @AuthenticatedUser() user: UserEntity,
    @Query() params: NftExchangeListRequest,
  ) {
    const result = await this.nftExchangeService.getNftExchangeList(
      params,
      user.id,
    );

    return new ResponsesListDto(result.list, result.total);
  }

  @ApiDescription({
    tags: 'NFT Exchange',
    summary: 'NFT 교환 제안 수락',
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    dataResponse: {
      status: HttpStatus.OK,
      schema: true,
    },
    exceptions: [
      ContentNotFoundError,
      InsufficientNFTError,
      NFTBalanceChangedError,
      SelfAcceptForbidden,
      ActionNotPermittedError,
    ],
  })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('accept/:id')
  async acceptNftExchange(
    @AuthenticatedUser() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<boolean> {
    return this.nftExchangeService.acceptNftExchange(user.id, id);
  }

  @ApiDescription({
    tags: 'NFT Exchange',
    summary: '교환 제안 상세 보기',
    dataResponse: {
      status: HttpStatus.OK,
      schema: NftExchangeOfferDetailResponse,
    },
    exceptions: [ContentNotFoundError],
  })
  @Get(':id')
  async getNftExchangeById(
    @Param('id') id: number,
  ): Promise<ResponsesDataDto<NftExchangeOfferDetailResponse>> {
    const result = await this.nftExchangeService.getNftExchangeById(id);

    return new ResponsesDataDto(result);
  }
}
