import { Inject, Injectable } from '@nestjs/common';
import { ethers, InterfaceAbi } from 'ethers';
import 'dotenv/config';

import { TransactionRepositoryService } from '../repository/service/transaction.repository.service';
import { LogTransactionEntity } from '../repository/entity/log-transaction.entity';
import { BlockchainCoreService } from './blockchain.core.service';
import { NULL_ADDRESS, TopicToAbi } from './dto/blockchain.dto';
import { EventTopicName } from '../repository/enum/transaction.enum';
import { ContractKey, ContractType } from '../repository/enum/contract.enum';
import { NftRepositoryService } from '../repository/service/nft.repository.service';
import { ItemRepositoryService } from '../repository/service/item.repository.service';
import { PuzzleRepositoryService } from './../repository/service/puzzle.repository.service';

@Injectable()
export class BlockchainTransactionService {
  constructor(
    @Inject(TransactionRepositoryService)
    private readonly txnRepositoryService: TransactionRepositoryService,

    @Inject(NftRepositoryService)
    private readonly nftRepositoryService: NftRepositoryService,

    @Inject(ItemRepositoryService)
    private readonly itemRepositoryService: ItemRepositoryService,

    @Inject(PuzzleRepositoryService)
    private readonly puzzleRepositoryService: PuzzleRepositoryService,

    @Inject(BlockchainCoreService)
    private readonly coreService: BlockchainCoreService,
  ) {}

  async getAllTxLogs() {
    return await this.txnRepositoryService.getAllLogs();
  }

  async syncAllNftOwnersOfLogs(logs: Partial<LogTransactionEntity>[]) {
    const nftContracts = await this.nftRepositoryService.findContractsByType(
      ContractType.ERC721,
    );

    let puzzlePieceMintedLogs: Partial<LogTransactionEntity>[] = [];
    let blueprintMintedLogs: Partial<LogTransactionEntity>[] = [];
    let materialMintedLogs: Partial<LogTransactionEntity>[] = [];

    logs.forEach((log) => {
      let contractKey = nftContracts.find(
        (e) => e.address === log.contractAddress,
      ).key;
      let sameTokenLogs: Partial<LogTransactionEntity>[];

      switch (contractKey) {
        case ContractKey.PUZZLE_PIECE:
          // 동일한 tokenId 에 대한 로그가 여러 개 존재한다면,
          // 가장 최신 로그만 반영
          sameTokenLogs = puzzlePieceMintedLogs.filter(
            (e) => e.tokenId === log.tokenId,
          );
          if (sameTokenLogs.length < 1) {
            puzzlePieceMintedLogs.push(log);
          } else {
            if (sameTokenLogs[0].timestamp <= log.timestamp) {
              puzzlePieceMintedLogs.push(log);
            }
          }
          break;
        case ContractKey.ITEM_BLUEPRINT:
          // 동일한 tokenId 에 대한 로그가 여러 개 존재한다면,
          // 가장 최신 로그만 반영
          sameTokenLogs = blueprintMintedLogs.filter(
            (e) => e.tokenId === log.tokenId,
          );
          if (sameTokenLogs.length < 1) {
            blueprintMintedLogs.push(log);
          } else {
            if (sameTokenLogs[0].timestamp <= log.timestamp) {
              blueprintMintedLogs.push(log);
            }
          }
          break;
        case ContractKey.ITEM_MATERIAL:
          // 동일한 tokenId 에 대한 로그가 여러 개 존재한다면,
          // 가장 최신 로그만 반영
          sameTokenLogs = materialMintedLogs.filter(
            (e) => e.tokenId === log.tokenId,
          );
          if (sameTokenLogs.length < 1) {
            materialMintedLogs.push(log);
          } else {
            if (sameTokenLogs[0].timestamp <= log.timestamp) {
              materialMintedLogs.push(log);
            }
          }
          break;
      }
    });

    await Promise.all([
      ...puzzlePieceMintedLogs.map((e) =>
        this.puzzleRepositoryService.updateOwner(
          e.tokenId,
          ethers.getAddress(e.to),
        ),
      ),
      ...blueprintMintedLogs.map((e) => {
        this.itemRepositoryService.updateBlueprintOwner(
          e.tokenId,
          ethers.getAddress(e.to),
        );
      }),
      ...materialMintedLogs.map((e) => {
        this.itemRepositoryService.upsertMaterialOnwer(
          e.tokenId,
          ethers.getAddress(e.to),
          e.contractAddress,
          e.from,
        );
      }),
    ]);
  }

  decodeLogData(log: ethers.Log, abi: InterfaceAbi): ethers.LogDescription {
    const iface = new ethers.Interface(abi);
    const decodedLog = iface.parseLog(log);

    return decodedLog;
  }

  async upsertTransactionLogs(logs: Partial<LogTransactionEntity>[]) {
    await this.txnRepositoryService.upsertLogs(logs);
  }

  async findLastSyncedBlock(): Promise<number> {
    const blockNumber =
      await this.txnRepositoryService.findLatestSyncedBlockNumber();

    return blockNumber;
  }

  async processLog(
    collectedLogs: ethers.Log[],
  ): Promise<Partial<LogTransactionEntity>[]> {
    const rowsToInsert: Partial<LogTransactionEntity>[] = [];
    let blockNumberToTimestamp: { [blockNumber: number]: number } = {};
    for (let log of collectedLogs) {
      const {
        blockNumber,
        blockHash,
        transactionHash,
        address,
        transactionIndex,
      } = log;
      if (!(blockNumber in blockNumberToTimestamp)) {
        const block = await this.coreService.getBlockByNumber(blockNumber);

        blockNumberToTimestamp[blockNumber] = block.timestamp;
      }
      const decodedLog = this.decodeLogData(log, TopicToAbi.transfer);
      const [from, to, tokenId] = decodedLog.args;
      let topic: EventTopicName;
      if (to === NULL_ADDRESS) {
        topic = EventTopicName.Burn;
      } else if (from === NULL_ADDRESS) {
        topic = EventTopicName.Mint;
      } else {
        topic = EventTopicName.Transfer;
      }

      rowsToInsert.push({
        contractAddress: ethers.getAddress(address),
        blockHash,
        blockNumber,
        from: ethers.getAddress(from),
        to: ethers.getAddress(to),
        tokenId: parseInt(tokenId),
        topic,
        timestamp: blockNumberToTimestamp[blockNumber],
        transactionHash,
        transactionIndex,
      });
    }

    return rowsToInsert;
  }
}
