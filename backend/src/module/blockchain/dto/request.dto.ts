import { Type } from 'class-transformer';

export class CollecTransactionDto {
  @Type(() => Number)
  fromBlock: number;

  @Type(() => Number)
  toBlock: number;
}
