import { ConfigService } from '../config/config.service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ethers } from 'ethers';

import { BlockchainCoreService } from '../blockchain/blockchain.core.service';
import { BlockchainTransactionService } from '../blockchain/blockchain.transaction.service';
import { NftRepositoryService } from '../repository/service/nft.repository.service';
import { CacheService } from '../cache/cache.service';
import { RedisKey } from '../cache/enum/cache.enum';
import { LogTransactionEntity } from '../repository/entity/log-transaction.entity';
import { CollectRangeDto, EventTopic } from '../blockchain/dto/blockchain.dto';
import { ContractKey, ContractType } from '../repository/enum/contract.enum';
import { ApiRequestLimits, RPCProvider } from './constants/rpc-provider';
import { ReportProvider } from 'src/provider/report.provider';

@Injectable()
export class TransactionCollectionScheduler {
  constructor(
    @Inject(BlockchainCoreService)
    private readonly blockchainCoreService: BlockchainCoreService,

    @Inject(BlockchainTransactionService)
    private readonly blockchainTransactionService: BlockchainTransactionService,

    @Inject(NftRepositoryService)
    private readonly nftRepositoryService: NftRepositoryService,

    @Inject(CacheService)
    private readonly memory: CacheService,

    private readonly configService: ConfigService,
  ) {}

  @Cron('*/5 * 0-5 * * *', { timeZone: 'UTC' })
  async collectBlockchainTransaction_0() {
    await this._collectBlockchainTransaction(0);
  }

  @Cron('*/5 * 6-11 * * *', {
    timeZone: 'UTC',
  })
  async collectBlockchainTransaction_1() {
    await this._collectBlockchainTransaction(1);
  }

  @Cron('*/5 * 12-17 * * *', {
    timeZone: 'UTC',
  })
  async collectBlockchainTransaction_2() {
    await this._collectBlockchainTransaction(2);
  }

  @Cron('*/5 * 18-23 * * *', {
    timeZone: 'UTC',
  })
  async collectBlockchainTransaction_3() {
    await this._collectBlockchainTransaction(3);
  }

  private async _collectBlockchainTransaction(rpcProvider: RPCProvider) {
    const { maxBlockRange, rps } = ApiRequestLimits[rpcProvider];

    const isLocal = this.configService.isLocal();
    if (isLocal) {
      return;
    }

    if (await this.isSchedulerRunning()) {
      console.log('Scheduler is already running');
      return;
    }

    await this.setStartFlag();

    // 블록체인 네트워크의 최신 블록 가져오기
    const latestBlock =
      await this.blockchainCoreService.getLatestBlockNumberHex();
    console.log('latestBlock: ', latestBlock);

    console.time('collectBlockchainTransaction');

    try {
      // 마지막으로 수집된 블록넘버 가져오기
      const lastSyncedBlock: number = await this.getStartBlock();
      console.log(lastSyncedBlock);

      const blockRange = parseInt(latestBlock, 16) - lastSyncedBlock;
      if (blockRange < 1) {
        return;
      }
      console.log('blockRange: ', blockRange);

      let collectedLogs: ethers.Log[] = [];
      const nftContracts = await this.nftRepositoryService.findContractsByType(
        ContractType.ERC721,
      );

      const nftContractAddresses = nftContracts.map((e) => e.address);
      if (blockRange > maxBlockRange) {
        let collectLogDtos: CollectRangeDto[] = [];
        for (let i = 0; i < Math.floor(blockRange / maxBlockRange) + 1; i++) {
          collectLogDtos.push({
            contractAddress: nftContractAddresses,
            fromBlock: lastSyncedBlock + maxBlockRange * i,
            toBlock: lastSyncedBlock + maxBlockRange * (i + 1) - 1,
            topics: [EventTopic.transfer],
          });
        }

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
              fromBlock: lastSyncedBlock,
              toBlock: parseInt(latestBlock, 16),
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

      // ReportProvider.info(
      //   'collectBlockchainTransaction',
      //   { collectedLogs },
      //   TransactionCollectionScheduler.name,
      //   this.configService.get<string>('DISCORD_WEBHOOK_URL_TX_COLLECT'),
      // );
    } catch (error) {
      Logger.error(error.stack);
      Logger.error(error);
      // ReportProvider.error(error, {}, TransactionCollectionScheduler.name);
    } finally {
      await this.setEndFlag();
      console.timeEnd('collectBlockchainTransaction');
    }
  }

  private async isSchedulerRunning() {
    return this.memory.find(RedisKey.transactionCollectionInProgress);
  }

  async setStartFlag() {
    await this.memory.set(
      RedisKey.transactionCollectionInProgress,
      'true',
      600_000, // 10분
    );
  }

  async setEndFlag() {
    await this.memory.remove(RedisKey.transactionCollectionInProgress);
  }

  private async getStartBlock() {
    // 마지막으로 수집된 블록넘버 가져오기
    let lastSyncedBlock =
      await this.blockchainTransactionService.findLastSyncedBlock();

    // 없을 경우(처음 수집하는 경우) 컨트랙트의 생성 블록넘버로 설정
    if (!lastSyncedBlock) {
      const birthBlockOfContract = (
        await this.nftRepositoryService.findContractByKey(
          ContractKey.PLAY_DUZZLE,
        )
      ).birthBlock;
      lastSyncedBlock = birthBlockOfContract;
    }

    return lastSyncedBlock;
  }
}
