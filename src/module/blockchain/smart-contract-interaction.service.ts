import { Injectable, Logger } from '@nestjs/common';
import { AddressLike, BigNumberish, Contract, ethers } from 'ethers';
import { NftRepositoryService } from '../repository/service/nft.repository.service';
import { ContractKey } from '../repository/enum/contract.enum';
import { abi as DalAbi } from './abi/Dal.json';
import { abi as MaterialItemAbi } from './abi/MaterialItem.json';

import { ConfigService } from '../config/config.service';
import { Dal } from './typechain/contracts/erc-20';
import { NFTSwapAbi } from './abi/NFTSwap.abi';
import { NFTSwap } from './typechain/contracts/service';

@Injectable()
export class SmartContractInteractionService {
  private readonly signer: ethers.Wallet;

  constructor(
    private configService: ConfigService,
    private readonly nftRepositoryService: NftRepositoryService,
  ) {
    const provider = new ethers.JsonRpcProvider(
      this.configService.get<string>('BLOCKCHAIN_POLYGON_RPC_ENDPOINT'),
    );
    this.signer = new ethers.Wallet(process.env.OWNER_PK_AMOY, provider);
  }

  async verifyNFTOwnershipAndApproval(
    nftAddress: string,
    tokenId: string,
    ownerAddress: string,
  ): Promise<boolean> {
    const nftContract = new ethers.Contract(
      nftAddress,
      MaterialItemAbi,
      this.signer,
    );

    try {
      const owner = await nftContract.ownerOf(tokenId);
      if (owner.toLowerCase() !== ownerAddress.toLowerCase()) {
        console.error(`Ownership verification failed for token ${tokenId}`);
        return false;
      }

      const nftSwapContractAddress: string = (
        await this.nftRepositoryService.findContractByKey(ContractKey.NFT_SWAP)
      ).address;

      const isApproved = await nftContract.isApprovedForAll(
        ownerAddress,
        nftSwapContractAddress,
      );
      if (!isApproved) {
        console.error(`Approval not set for token ${tokenId}`);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Error verifying NFT ${tokenId}:`, error);
      return false;
    }
  }

  async mintDalToken(to: string, count: number): Promise<void> {
    const dalContractAddress: string = (
      await this.nftRepositoryService.findContractByKey(ContractKey.DAL)
    ).address;
    const dalContract: Dal = new Contract(
      dalContractAddress,
      DalAbi,
      this.signer,
    ) as unknown as Dal;

    await dalContract.mint(to, ethers.parseEther(String(count)));
  }

  async nftSwap(
    nftContractsGivenByA: AddressLike[],
    tokenIdsGivenByA: BigNumberish[],
    nftContractsGivenByB: AddressLike[],
    tokenIdsGivenByB: BigNumberish[],
    userA: AddressLike,
    userB: AddressLike,
  ): Promise<{
    success: boolean;
    transactionHash: string;
    failureReason?: string;
  }> {
    // NFT 소유권 및 승인 여부 확인(TODO: 어차피 프론트에서 검증기도하고, 불필요하진않지만 시간상 주석처리 해두기)
    /**
    for (let i = 0; i < nftContractsGivenByA.length; i++) {
      const isValid = await this.verifyNFTOwnershipAndApproval(
        nftContractsGivenByA[i] as string,
        tokenIdsGivenByA[i] as string,
        userA as string,
      );
      if (!isValid) {
        throw new Error(
          `Invalid NFT for swap(A): ${nftContractsGivenByA[i]} - ${tokenIdsGivenByA[i]}`,
        );
      }
    }

    for (let i = 0; i < nftContractsGivenByB.length; i++) {
      const isValid = await this.verifyNFTOwnershipAndApproval(
        nftContractsGivenByB[i] as string,
        tokenIdsGivenByB[i] as string,
        userB as string,
      );
      if (!isValid) {
        throw new Error(
          `Invalid NFT for swap(B): ${nftContractsGivenByB[i]} - ${tokenIdsGivenByB[i]}`,
        );
      }
    }
 */

    try {
      const nftSwapContractAddress: string = (
        await this.nftRepositoryService.findContractByKey(ContractKey.NFT_SWAP)
      ).address;

      const nftSwapContract: NFTSwap = new ethers.Contract(
        nftSwapContractAddress,
        NFTSwapAbi,
        this.signer,
      ) as unknown as NFTSwap;

      const estimateGas = await nftSwapContract.executeNFTSwap.estimateGas(
        nftContractsGivenByA,
        tokenIdsGivenByA,
        nftContractsGivenByB,
        tokenIdsGivenByB,
        userA,
        userB,
      );

      const tx = await nftSwapContract.executeNFTSwap(
        nftContractsGivenByA,
        tokenIdsGivenByA,
        nftContractsGivenByB,
        tokenIdsGivenByB,
        userA,
        userB,
        { gasLimit: estimateGas },
      );

      const receipt = await tx.wait();

      if (receipt.status === 1) {
        return {
          success: true,
          transactionHash: receipt.hash,
        };
      } else {
        Logger.error(receipt);
        return {
          success: false,
          transactionHash: receipt.hash,
          failureReason: 'Transaction failed',
        };
      }
    } catch (error) {
      Logger.error(error);
      Logger.error(error.stack);
      return {
        success: false,
        transactionHash: error.transactionHash,
        failureReason: error.message || 'Transaction failed',
      };
    }
  }
}
