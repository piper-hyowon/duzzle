import { Injectable } from '@nestjs/common';

import { PuzzleRepositoryService } from '../repository/service/puzzle.repository.service';
import { NftRepositoryService } from './../repository/service/nft.repository.service';
import { SeasonEntity } from '../repository/entity/season.entity';
import {
  PuzzlePieces,
  UserPuzzleDetailResponse,
  UserPuzzlePiecesResponse,
  UserPuzzleRequest,
  UserPuzzleResponse,
} from './user.puzzle.dto';
import { PaginatedList } from 'src/dto/response.dto';
import { PuzzlePieceEntity } from '../repository/entity/puzzle-piece.entity';
import { PuzzlePieceDto, PuzzleResponse } from './dto/puzzle.dto';

@Injectable()
export class PuzzleService {
  constructor(
    private readonly puzzleRepositoryService: PuzzleRepositoryService,
  ) {}

  async getNftHoldersBySeasonId(
    seasonId: number,
  ): Promise<Pick<PuzzlePieceEntity, 'holerWalletAddress' | 'holderName'>[]> {
    return this.puzzleRepositoryService.getNftHoldersBySeasonId(seasonId);
  }

  async getThisSeason(): Promise<SeasonEntity> {
    return this.puzzleRepositoryService.getThisSeason();
  }

  async getAllSeasons(): Promise<SeasonEntity[]> {
    return this.puzzleRepositoryService.getAllSeasons();
  }

  async getSeasonIfPast(seasonId: number): Promise<SeasonEntity> {
    return this.puzzleRepositoryService.getSeasonIfPast(seasonId);
  }

  async getSeasonById(id: number): Promise<SeasonEntity> {
    const season = await this.puzzleRepositoryService.getSeasonById(id);

    return season;
  }

  async getPuzzleData(seasonId: number): Promise<PuzzleResponse> {
    const _pieces =
      await this.puzzleRepositoryService.getPuzzlePiecesBySeasonId(seasonId);
    const minted = _pieces.filter((e) => e.minted).length;

    const total = _pieces[0].seasonZone.season.totalPieces;
    const result: PuzzleResponse = {
      total,
      minted,
      pieces: _pieces.map((e) => PuzzlePieceDto.from(e)),
    };

    return result;
  }

  async getTotalPiecesByUser(userId: number): Promise<number> {
    const totalPieces =
      await this.puzzleRepositoryService.getTotalPiecesByUser(userId);

    return totalPieces;
  }

  async getUserPiecesBySeason(
    userId: number,
  ): Promise<UserPuzzlePiecesResponse> {
    let page = 0;
    let hasMore = true;

    const puzzleMap = new Map<number, PuzzlePieces>();

    while (hasMore) {
      const puzzles = (
        await this.puzzleRepositoryService.findPuzzlesByUserId(userId, {
          page,
          count: 100,
        })
      ).list;

      if (puzzles.length > 0) {
        puzzles.forEach((puzzle) => {
          const key = puzzle.seasonZoneId;
          if (puzzleMap.has(key)) {
            puzzleMap.get(key)!.count++;
          } else {
            puzzleMap.set(key, {
              season: puzzle.seasonZone.season.titleKr,
              zone: puzzle.seasonZone.zone.nameKr,
              image: puzzle.metadata.metadata.image,
              count: 1,
            });
          }
        });
        page++;
      } else {
        hasMore = false;
      }
    }

    const result: UserPuzzlePiecesResponse = {
      puzzles: Array.from(puzzleMap.values()),
    };

    return result;
  }

  async getPuzzlesByUserId(
    userId: number,
    params: UserPuzzleRequest,
  ): Promise<PaginatedList<UserPuzzleResponse>> {
    const { list, total } =
      await this.puzzleRepositoryService.findPuzzlesByUserId(userId, params);

    const result: PaginatedList<UserPuzzleResponse> = {
      list: list.map((e) => UserPuzzleResponse.from(e)),
      total,
    };

    return result;
  }

  async getPuzzleById(
    userId: number,
    puzzleId: number,
  ): Promise<UserPuzzleDetailResponse> {
    const puzzle = await this.puzzleRepositoryService.getPuzzleByIdAndUserId(
      userId,
      puzzleId,
    );

    return UserPuzzleDetailResponse.from(puzzle);
  }
}
