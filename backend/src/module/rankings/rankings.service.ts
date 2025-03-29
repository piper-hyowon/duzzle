import { Inject } from '@nestjs/common';

import { PuzzleService } from '../puzzle/puzzle.service';
import { Rankings } from './dto/rankings.dto';
import { SeasonEntity } from '../repository/entity/season.entity';

export class RankingsService {
  constructor(
    @Inject(PuzzleService) private readonly puzzleService: PuzzleService,
  ) {}

  async getCurrentSeasonRankings(): Promise<Rankings[]> {
    const thisSeason = await this.puzzleService.getThisSeason();

    return this.getSeasonRankings(thisSeason);
  }

  async getSeasonRankingsById(seasonId: number): Promise<Rankings[]> {
    const season = await this.puzzleService.getSeasonById(seasonId);

    return this.getSeasonRankings(season);
  }

  private async getSeasonRankings(
    season: Pick<SeasonEntity, 'id' | 'totalPieces'>,
  ): Promise<Rankings[]> {
    const getNftHoldingsPercentage = (nftholdings: number) => {
      return (nftholdings / season.totalPieces) * 100;
    };

    const nftHolders = await this.puzzleService.getNftHoldersBySeasonId(
      season.id,
    );

    // address, name 으로 groupBy 해서 퍼즐 NFT 개수 카운트
    // -> 내림차순으로 정렬(동일 개수일 경우 순위 동일)
    const predata: Omit<Rankings, 'rank'>[] = nftHolders.reduce(
      (acc, cur) => {
        const index = acc.findIndex(
          (e: Rankings) => e.walletAddress === cur.holerWalletAddress,
        );
        if (index < 0) {
          acc.push({
            walletAddress: cur.holerWalletAddress,
            name: cur.holderName || 'Anonymous',
            nftHoldings: 1,
            nftHoldingsPercentage: getNftHoldingsPercentage(1),
          });
        } else {
          acc[index].nftHoldings += 1;
          acc[index].nftHoldingsPercentage = getNftHoldingsPercentage(
            acc[index].nftHoldings,
          );
        }

        return acc;
      },
      <Omit<Rankings, 'rank'>[]>[],
    );

    // nftHoldings 기준으로 내림차순 정렬
    const sorted = predata.sort((a, b) => {
      return b.nftHoldings - a.nftHoldings;
    });

    const rankings = sorted.reduce((acc, current, index) => {
      let rank: number;

      if (index === 0) {
        rank = 1;
      } else if (current.nftHoldings === acc[index - 1].nftHoldings) {
        rank = acc[index - 1].rank;
      } else {
        rank = acc[index - 1].rank + 1;
      }

      acc.push({
        ...current,
        rank,
      });

      return acc;
    }, [] as Rankings[]);

    return rankings;
  }
}
