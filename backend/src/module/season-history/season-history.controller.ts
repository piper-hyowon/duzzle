import { Controller, Get, HttpStatus, Query } from '@nestjs/common';

import {
  PuzzleHistoryResponse,
  SeasonHistoryBaseRequest,
  SeasonHistoryResponse,
} from './dto/season-history.dto';
import { ApiDescription } from 'src/decorator/api-description.decorator';
import { SeasonHistoryService } from './season-history.service';
import { ResponsesListDto } from 'src/dto/responses-list.dto';
import { Rankings } from '../rankings/dto/rankings.dto';
import { ResponsesDataDto } from 'src/dto/responses-data.dto';
import { ContentNotFoundError } from 'src/types/error/application-exceptions/404-not-found';

@Controller('season-history')
export class SeasonHistoryController {
  constructor(private readonly seasonHistoryService: SeasonHistoryService) {}

  @ApiDescription({
    tags: ['Season History(비로그인 상태에서도 조회 가능 ★)'],
    summary: '시즌 히스토리 목록',
    description: '현재 시즌 제외, 비로그인 상태에서도 조회 가능 ★',
    listResponse: {
      schema: SeasonHistoryResponse,
      status: HttpStatus.OK,
    },
  })
  @Get()
  async getSeasonHistoryList(): Promise<
    ResponsesListDto<SeasonHistoryResponse>
  > {
    const lastSeasons = await this.seasonHistoryService.getSeasonHistory();

    return new ResponsesListDto(lastSeasons);
  }

  @ApiDescription({
    tags: ['Season History(비로그인 상태에서도 조회 가능 ★)'],
    summary: '특정 시즌 랭킹 히스토리 조회',
    description: '현재 시즌 ID 입력시 404 에러 발생',
    listResponse: {
      status: HttpStatus.OK,
      schema: Rankings,
    },
    exceptions: [ContentNotFoundError],
  })
  @Get('rankings')
  async getRankingsHistory(
    @Query() query: SeasonHistoryBaseRequest,
  ): Promise<ResponsesListDto<Rankings>> {
    const rankings = await this.seasonHistoryService.getRankingsHistory(
      query.seasonId,
    );

    return new ResponsesListDto(rankings);
  }

  @ApiDescription({
    tags: ['Season History(비로그인 상태에서도 조회 가능 ★)'],
    summary: '특정 시즌 퍼즐 히스토리 조회',
    description:
      '- 퍼즐 현황 데이터 API(/v1/puzzle/{seasonId} GET 와 거의 동일\n\n\
    - mint 된 조각의 data 는 동일\n\n\
    - minted = false 인 조각의 data 는 null\n\n\
    현재 시즌 ID 입력시 404 에러 발생',
    dataResponse: {
      schema: PuzzleHistoryResponse,
      status: HttpStatus.OK,
    },
    exceptions: [ContentNotFoundError],
  })
  @Get('puzzle')
  async getPuzzleHistory(
    @Query() query: SeasonHistoryBaseRequest,
  ): Promise<ResponsesDataDto<PuzzleHistoryResponse>> {
    const puzzleHistory = await this.seasonHistoryService.getPuzzleHistory(
      query.seasonId,
    );

    return new ResponsesDataDto(puzzleHistory);
  }
}
