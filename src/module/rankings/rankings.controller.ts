import { Controller, Get, HttpStatus } from '@nestjs/common';

import { ResponsesListDto } from 'src/dto/responses-list.dto';
import { Rankings } from './dto/rankings.dto';
import { ApiDescription } from 'src/decorator/api-description.decorator';
import { RankingsService } from './rankings.service';

@Controller('rankings')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @ApiDescription({
    tags: 'Rankings',
    summary: '현재 시즌 퍼즐 조각 잠금해제 랭킹 조회',
    listResponse: {
      status: HttpStatus.OK,
      schema: Rankings,
    },
  })
  @Get('current-season')
  async getCurrentSeasonRankings(): Promise<ResponsesListDto<Rankings>> {
    const rankings = await this.rankingsService.getCurrentSeasonRankings();

    return new ResponsesListDto(rankings);
  }
}
