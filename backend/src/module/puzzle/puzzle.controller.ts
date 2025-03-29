import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';

import { PuzzleService } from './puzzle.service';
import { PuzzleRequest, PuzzleResponse } from './dto/puzzle.dto';
import { ResponsesDataDto } from 'src/dto/responses-data.dto';
import { ResponsesListDto } from 'src/dto/responses-list.dto';
import { AuthorizationToken } from 'src/constant/authorization-token';
import { AuthGuard } from '../auth/auth.guard';
import {
  UserPuzzleDetailResponse,
  UserPuzzlePathParams,
  UserPuzzleRequest,
  UserPuzzleResponse,
} from './user.puzzle.dto';
import { SeasonEntity } from '../repository/entity/season.entity';
import { Zone, ZONES } from 'src/constant/zones';
import { AuthenticatedUser } from '../auth/decorators/authenticated-user.decorator';
import { ApiDescription } from 'src/decorator/api-description.decorator';
import { UserEntity } from '../repository/entity/user.entity';

@Controller()
export class PuzzleController {
  constructor(private readonly puzzleService: PuzzleService) {}

  @ApiDescription({
    tags: 'Puzzle',
    summary: '전체 시즌 목록',
    listResponse: {
      status: HttpStatus.OK,
      schema: SeasonEntity,
    },
  })
  @HttpCode(HttpStatus.OK)
  @Get('seasons')
  async getAllSeasons(): Promise<ResponsesListDto<SeasonEntity>> {
    const seaons = await this.puzzleService.getAllSeasons();

    return new ResponsesListDto(seaons);
  }

  @ApiDescription({
    tags: 'Puzzle',
    summary: '전체 구역 목록',
    listResponse: {
      status: HttpStatus.OK,
      schema: Zone,
    },
  })
  @HttpCode(HttpStatus.OK)
  @Get('zones')
  async getAllZones(): Promise<ResponsesListDto<Zone>> {
    return new ResponsesListDto(ZONES);
  }

  @ApiDescription({
    tags: 'Puzzle',
    summary: '퍼즐 현황 데이터',
    dataResponse: {
      status: HttpStatus.OK,
      schema: PuzzleResponse,
    },
  })
  @HttpCode(HttpStatus.OK)
  @Get('puzzle/:seasonId')
  async getPuzzleData(
    @Param() dto: PuzzleRequest,
  ): Promise<ResponsesDataDto<PuzzleResponse>> {
    await this.puzzleService.getSeasonById(dto.seasonId);
    const result = await this.puzzleService.getPuzzleData(dto.seasonId);

    return new ResponsesDataDto(result);
  }

  @ApiDescription({
    tags: 'Puzzle',
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    summary: '유저 보유 퍼즐 조각 NFT 목록',
    listResponse: {
      status: HttpStatus.OK,
      schema: UserPuzzleResponse,
    },
  })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('my/nft-puzzles')
  async getUserPuzzles(
    @AuthenticatedUser() user: UserEntity,
    @Query() params: UserPuzzleRequest,
  ): Promise<ResponsesListDto<UserPuzzleResponse>> {
    const result = await this.puzzleService.getPuzzlesByUserId(user.id, params);

    return new ResponsesListDto(result.list, result.total);
  }

  @UseGuards(AuthGuard)
  @ApiDescription({
    tags: 'Puzzle',
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    summary: '유저 보유 퍼즐 조각 NFT 상세',
    dataResponse: {
      status: HttpStatus.OK,
      schema: UserPuzzleDetailResponse,
    },
  })
  @HttpCode(HttpStatus.OK)
  @Get('my/nft-puzzles/:id')
  async getUserPuzzleById(
    @AuthenticatedUser() user: UserEntity,
    @Param() params: UserPuzzlePathParams,
  ): Promise<ResponsesDataDto<UserPuzzleDetailResponse>> {
    const puzzle = await this.puzzleService.getPuzzleById(user.id, params.id);

    return new ResponsesDataDto(puzzle);
  }
}
