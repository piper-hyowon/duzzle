import { ApiProperty } from '@nestjs/swagger';

export class Rankings {
  @ApiProperty()
  rank: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  walletAddress: string;

  @ApiProperty({ description: '보유한 퍼즐 NFT 개수' })
  nftHoldings: number;

  @ApiProperty({ description: '보유한 퍼즐 NFT 개수 비율' })
  nftHoldingsPercentage: number;
}
