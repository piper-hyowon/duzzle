import { Module } from '@nestjs/common';
import { NftExchangeController } from './nft-exchange.controller';
import { NftExchangeService } from './nft-exchange.service';
import { RepositoryModule } from '../repository/repository.module';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { NftExchangeMappingService } from './nft-exchange-mapping.service';

@Module({
  imports: [RepositoryModule, BlockchainModule],
  providers: [NftExchangeService, NftExchangeMappingService],
  controllers: [NftExchangeController],
})
export class NftExchangeModule {}
