import { BlockchainCoreService } from './blockchain.core.service';
import { NftRepositoryService } from './../repository/service/nft.repository.service';
import { Controller, Inject, Logger, Post, Query } from '@nestjs/common';
import { BlockchainTransactionService } from './blockchain.transaction.service';
import { CollecTransactionDto } from './dto/request.dto';
import { ContractType } from '../repository/enum/contract.enum';
import { CollectRangeDto, EventTopic } from './dto/blockchain.dto';
import { ethers } from 'ethers';
import { LogTransactionEntity } from '../repository/entity/log-transaction.entity';
import { ReportProvider } from 'src/provider/report.provider';
import { TransactionCollectionScheduler } from '../scheduler/transaction-collection.scheduler.service';
import { ConfigService } from '../config/config.service';

@Controller()
export class BlockchainController {
  constructor(
    @Inject(BlockchainTransactionService)
    private readonly txService: BlockchainTransactionService,

    private readonly nftRepositoryService: NftRepositoryService,

    private readonly blockchainCoreService: BlockchainCoreService,

    private readonly blockchainTransactionService: BlockchainTransactionService,

    private readonly configService: ConfigService,
  ) {}

  @Post('retry-data-sync')
  async retryDataSync(): Promise<string> {
    const allLogs = await this.txService.getAllTxLogs();
    await this.txService.syncAllNftOwnersOfLogs(allLogs);

    return 'OK';
  }

  // TODO: wip
  @Post('retry-collect-and-sync')
  async collectBlockchainTransaction(@Query() params: CollecTransactionDto) {
    const nftContracts = await this.nftRepositoryService.findContractsByType(
      ContractType.ERC721,
    );
    const { fromBlock, toBlock } = params;
    const blockRange = toBlock - fromBlock;

    const maxBlockRange = 10_000;
    let collectedLogs: ethers.Log[] = [];
    const rpcProvider = 0;
    try {
      const nftContractAddresses = nftContracts.map((e) => e.address);
      if (blockRange > maxBlockRange) {
        let collectLogDtos: CollectRangeDto[] = [];
        for (let i = 0; i < Math.floor(blockRange / maxBlockRange) + 1; i++) {
          collectLogDtos.push({
            contractAddress: nftContractAddresses,
            fromBlock: maxBlockRange * i,
            toBlock: maxBlockRange * (i + 1) - 1,
            topics: [EventTopic.transfer],
          });
        }

        const rps = 10;
        console.log('collectLogDto length: ', collectLogDtos.length);
        // Infura API 요청 제한을 고려하여 요청을 분할하여 처리
        if (collectLogDtos.length < rps) {
          collectedLogs = (
            await this.blockchainCoreService.getLogs(
              collectLogDtos,
              rpcProvider,
            )
          ).flat();
        } else {
          for (let i: number = 0; i < collectLogDtos.length; i += rps) {
            const batch = collectLogDtos.slice(i, i + rps);

            console.log(batch.length);

            let logs: ethers.Log[] = (
              await this.blockchainCoreService.getLogs(batch, rpcProvider)
            ).flat();

            collectedLogs = [...collectedLogs, ...logs];

            if (i + rps < collectLogDtos.length) {
              await new Promise((resolve) => setTimeout(resolve, 1_000)); // 1 seconds
            }
          }
        }
      } else {
        collectedLogs = await this.blockchainCoreService.getLogs(
          [
            {
              contractAddress: nftContractAddresses,
              fromBlock,
              toBlock,
              topics: [EventTopic.transfer],
            },
          ],
          rpcProvider,
        );
      }
      if (collectedLogs.length < 1) {
        return;
      }

      const txLogsToUpsert: Partial<LogTransactionEntity>[] =
        await this.blockchainTransactionService.processLog(collectedLogs);

      await Promise.all([
        this.blockchainTransactionService.syncAllNftOwnersOfLogs(
          txLogsToUpsert,
        ),
        this.blockchainTransactionService.upsertTransactionLogs(txLogsToUpsert),
      ]);

      ReportProvider.info(
        'collectBlockchainTransaction',
        { collectedLogs },
        TransactionCollectionScheduler.name,
        this.configService.get<string>('DISCORD_WEBHOOK_URL_TX_COLLECT'),
      );
    } catch (error) {
      Logger.error(error.stack);
      Logger.error(error);
      ReportProvider.error(error, {}, TransactionCollectionScheduler.name);
    } finally {
      console.timeEnd('collectBlockchainTransaction');
    }
  }
}
