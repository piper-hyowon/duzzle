import { UserRepositoryService } from './user.repository.service';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindManyOptions,
  FindOptionsWhere,
  LessThan,
} from 'typeorm';

import { PuzzlePieceEntity } from '../entity/puzzle-piece.entity';
import { SeasonEntity } from '../entity/season.entity';
import { UserPuzzleRequest } from 'src/module/puzzle/user.puzzle.dto';
import { PaginatedList } from 'src/dto/response.dto';
import { ContentNotFoundError } from 'src/types/error/application-exceptions/404-not-found';

@Injectable()
export class PuzzleRepositoryService {
  constructor(
    @InjectRepository(PuzzlePieceEntity)
    private puzzlePieceRepository: Repository<PuzzlePieceEntity>,

    @InjectRepository(SeasonEntity)
    private seasonRepository: Repository<SeasonEntity>,

    @Inject(UserRepositoryService)
    private userRepositoryService: UserRepositoryService,
  ) {}

  async getNftHoldersBySeasonId(
    seasonId: number,
  ): Promise<Pick<PuzzlePieceEntity, 'holerWalletAddress' | 'holderName'>[]> {
    return this.puzzlePieceRepository
      .createQueryBuilder('pp')
      .select('pp.holderName', 'holderName')
      .addSelect('pp.holerWalletAddress', 'holerWalletAddress')
      .leftJoin('pp.seasonZone', 'sz')
      .where('sz.seasonId = :seasonId', { seasonId })
      .andWhere('pp.minted = true')
      .getRawMany();
  }

  async getThisSeason(): Promise<SeasonEntity> {
    return this.seasonRepository.findOne({ where: {}, order: { id: 'DESC' } });
  }

  async findLastSeasons(): Promise<SeasonEntity[]> {
    const thisSeasonId: number = await this.seasonRepository.maximum('id');
    return await this.seasonRepository.find({
      where: {
        id: LessThan(thisSeasonId),
      },
      order: {
        id: 'ASC',
      },
    });
  }

  async getSeasonIfPast(seasonId: number) {
    const thisSeasonId: number = await this.seasonRepository.maximum('id');
    if (seasonId >= thisSeasonId) {
      throw new ContentNotFoundError('past seasonId', seasonId);
    }

    return this.getSeasonById(seasonId);
  }

  async getAllSeasons(): Promise<SeasonEntity[]> {
    return await this.seasonRepository.find();
  }

  async getSeasonById(seasonId: number): Promise<SeasonEntity> {
    const season = await this.seasonRepository.findOneBy({ id: seasonId });
    if (!season) {
      throw new ContentNotFoundError('seasonId', seasonId);
    }

    return season;
  }

  async getMintedPiecesBySeasonId(seasonId: number) {
    return this.puzzlePieceRepository.count({
      where: {
        seasonZone: {
          seasonId,
        },
        minted: true,
      },
      relations: {
        seasonZone: {
          season: true,
        },
      },
    });
  }

  async getPuzzlePiecesBySeasonId(
    seasonId: number,
  ): Promise<PuzzlePieceEntity[]> {
    const allPiecesInSeason = await this.puzzlePieceRepository.find({
      where: {
        seasonZone: {
          seasonId,
        },
      },
      relations: {
        seasonZone: {
          season: true,
          zone: true,
          requiredMaterialItems: {
            materialItem: {
              contract: true,
            },
          },
        },
        metadata: {
          contract: true,
        },
      },
      order: { id: 'ASC' },
    });

    return allPiecesInSeason;
  }

  async getPuzzlePiecesBySeasonIdWithoutItems(
    seasonId: number,
  ): Promise<PuzzlePieceEntity[]> {
    return this.puzzlePieceRepository.find({
      where: {
        seasonZone: {
          seasonId,
        },
      },
      relations: {
        seasonZone: { season: true, zone: true },
        metadata: true,
      },
      order: { id: 'ASC' },
    });
  }

  // TODO: 최신 토큰 획득 시간 추가(puzzle_piece 테이블에 mintedAt, lastTransferedAt 컬럼 필요)
  async updateOwner(tokenId: number, walletAddress: string): Promise<void> {
    const userName = (
      await this.userRepositoryService.findUserByWalletAddress(walletAddress)
    )?.name;
    await this.puzzlePieceRepository.query(
      `
    UPDATE puzzle_piece pp
    SET minted               = true,
        holder_name          = $1,
        holer_wallet_address = $2
    WHERE pp.id = (
                    SELECT pp_inner.id
                    FROM puzzle_piece pp_inner
                        JOIN nft_metadata nft ON pp_inner.nft_metadata_id = nft.id
                    WHERE nft.token_id = $3
                    LIMIT 1);`,
      [userName, walletAddress, tokenId],
    );
  }

  async findPuzzlesByUserId(
    userId: number,
    params: UserPuzzleRequest,
  ): Promise<PaginatedList<PuzzlePieceEntity>> {
    const userWalletAddress = (
      await this.userRepositoryService.findUserById(userId)
    ).walletAddress;

    const { count, page } = params;
    const offset = count * page;

    const where: FindOptionsWhere<PuzzlePieceEntity> = {
      holerWalletAddress: userWalletAddress,
    };

    if (params?.season !== undefined) {
      where.seasonZone = {
        season: {
          id: params.season,
        },
      };
    }

    if (params?.zone !== undefined) {
      where.seasonZone = {
        zone: {
          id: params.zone,
        },
      };
    }

    const findOption: FindManyOptions<PuzzlePieceEntity> = {
      where,
      relations: {
        metadata: true,
        seasonZone: {
          season: true,
          zone: true,
        },
      },
      skip: offset,
      take: count,
      order: { createdAt: 'DESC' },
    };

    const [list, total] =
      await this.puzzlePieceRepository.findAndCount(findOption);

    const result: PaginatedList<PuzzlePieceEntity> = {
      list,
      total,
    };

    return result;
  }

  async getPuzzleByIdAndUserId(
    userId: number,
    puzzleId: number,
  ): Promise<PuzzlePieceEntity> {
    const userWalletAddress = (
      await this.userRepositoryService.findUserById(userId)
    ).walletAddress;

    const puzzle = await this.puzzlePieceRepository.findOne({
      where: {
        id: puzzleId,
        holerWalletAddress: userWalletAddress,
      },
      relations: {
        metadata: true,
        seasonZone: {
          season: true,
          zone: true,
        },
      },
    });

    if (!puzzle) {
      throw new ContentNotFoundError('puzzle', puzzleId);
    }

    return puzzle;
  }

  async getTotalPiecesByUser(userId: number): Promise<number> {
    const userWalletAddress = (
      await this.userRepositoryService.findUserById(userId)
    ).walletAddress;

    const totalPieces = await this.puzzlePieceRepository.countBy({
      holerWalletAddress: userWalletAddress,
    });

    return totalPieces;
  }

  async getUserPiecesBySeasonZoneId(
    userId: number,
    seasonZoneId: number,
  ): Promise<PuzzlePieceEntity[]> {
    const userWalletAddress = (
      await this.userRepositoryService.findUserById(userId)
    ).walletAddress;

    return this.puzzlePieceRepository.find({
      where: {
        holerWalletAddress: userWalletAddress,
        seasonZone: {
          id: seasonZoneId,
        },
      },
      relations: {
        metadata: {
          contract: true,
        },
      },
    });
  }
}
