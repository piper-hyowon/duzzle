import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import {
  PuzzleHistoryResponse,
  PuzzlePieceDto,
  SeasonHistoryResponse,
} from './dto/season-history.dto';
import { SeasonEntity } from '../repository/entity/season.entity';
import { Rankings } from '../rankings/dto/rankings.dto';
import { RankingsService } from './../rankings/rankings.service';
import { PuzzleRepositoryService } from './../repository/service/puzzle.repository.service';

@Injectable()
export class SeasonHistoryService {
  constructor(
    private readonly puzzleRepositoryService: PuzzleRepositoryService,
    private readonly rankingsService: RankingsService,
  ) {}

  async getSeasonHistory(): Promise<SeasonHistoryResponse[]> {
    const seasons: SeasonEntity[] =
      await this.puzzleRepositoryService.findLastSeasons();

    const getSeasonHistory = async (season: SeasonEntity) => {
      const mintedPieces =
        await this.puzzleRepositoryService.getMintedPiecesBySeasonId(season.id);

      return plainToInstance(
        SeasonHistoryResponse,
        {
          ...season,
          mintedPieces,
        },
        { excludeExtraneousValues: true },
      );
    };

    return Promise.all(seasons.map((season) => getSeasonHistory(season)));
  }

  async getRankingsHistory(seasonId: number): Promise<Rankings[]> {
    await this.puzzleRepositoryService.getSeasonIfPast(seasonId);

    return this.rankingsService.getSeasonRankingsById(seasonId);
  }

  async getUserRankingHistory(walletAddress: string): Promise<Rankings[]> {
    const seasons = await this.puzzleRepositoryService.getAllSeasons();

    const rankings: Rankings[] = [];

    for (const season of seasons) {
      const rankingHistory = await this.rankingsService.getSeasonRankingsById(
        season.id,
      );
      const userRanking = rankingHistory.find(
        (ranking) => ranking.walletAddress === walletAddress,
      );

      if (userRanking) {
        rankings.push(userRanking);
      }
    }

    return rankings;
  }

  async getPuzzleHistory(seasonId: number): Promise<PuzzleHistoryResponse> {
    await this.puzzleRepositoryService.getSeasonIfPast(seasonId);

    // 시즌 히스토리에서는 민트된 조각의 정보만 가져옴
    const _pieces =
      await this.puzzleRepositoryService.getPuzzlePiecesBySeasonIdWithoutItems(
        seasonId,
      );
    const minted = _pieces.filter((e) => e.minted).length;

    const total = _pieces[0].seasonZone.season.totalPieces;
    const result: PuzzleHistoryResponse = {
      total,
      minted,
      pieces: _pieces.map((e) => PuzzlePieceDto.from(e)),
    };

    return result;
  }
}
