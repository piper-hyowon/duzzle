import { NftExchangeRepositoryService } from './../repository/service/nft-exchange.repository.service';
import { PuzzleRepositoryService } from './../repository/service/puzzle.repository.service';
import { ItemRepositoryService } from './../repository/service/item.repository.service';
import { Injectable } from '@nestjs/common';
import { AddressLike, BigNumberish } from 'ethers';
import { NftExchangeOfferEntity } from 'src/module/repository/entity/nft-exchange-offers.entity';
import { NFTAsset, NFTCheckResult, NFTType } from './domain/nft-asset';
import {
  InsufficientNFTError,
  NFTBalanceChangedError,
} from 'src/types/error/application-exceptions/400-bad-request';
import { UserMaterialItemEntity } from '../repository/entity/user-material-item.entity';
import { BlueprintItemEntity } from '../repository/entity/blueprint-item.entity';
import { PuzzlePieceEntity } from '../repository/entity/puzzle-piece.entity';
import { NftExchangeOfferStatus } from '../repository/enum/nft-exchange-status.enum';

@Injectable()
export class NftExchangeMappingService {
  constructor(
    private readonly itemRepositoryService: ItemRepositoryService,
    private readonly puzzleRepositoryService: PuzzleRepositoryService,
    private readonly nftExchangeRepositoryService: NftExchangeRepositoryService,
  ) {}

  // 제안 Entity 를 (스마트컨트랙트) nftSwap 함수에 전달하기 위한 데이터로 변환
  /**
   * 제안 Entity 를 (스마트컨트랙트) nftSwap 함수에 전달하기 위한 데이터로 변환
   * 1. 제안 수락자의 NFT가 충분한지 확인
   * 2. 제안 등록자의 NFT가 충분한지 확인
   * 3. 충분한 NFT의 contractId, tokenId를 반환
   */
  async mapEntityToTokenIds(offerEntity: NftExchangeOfferEntity): Promise<{
    nftContractsGivenByA: AddressLike[];
    tokenIdsGivenByA: BigNumberish[];
    nftContractsGivenByB: AddressLike[];
    tokenIdsGivenByB: BigNumberish[];
    userA: AddressLike;
    userB: AddressLike;
  }> {
    // 제안 수락 유저 (A) acceptorId
    const userA: AddressLike = offerEntity.acceptor.walletAddress;

    // 제안 등록 유저 (B) offerorId
    const userB: AddressLike = offerEntity.offeror.walletAddress;

    // 제안 수락 유저의 NFT 확인
    // 어떤 NFT가 부족한지 자세히 응답함(API 호출자가 제안 수락자이기 때문)
    const {
      sufficientNFTs: sufficientNFTsA,
      insufficientNFTs: insufficientNFTsA,
    } = await this.checkNFTBalance(
      offerEntity.acceptorUserId,
      offerEntity.requestedNfts,
    );

    if (insufficientNFTsA.length > 0) {
      throw new InsufficientNFTError(insufficientNFTsA);
    }

    const nftContractsGivenByA = sufficientNFTsA.map(
      (nft) => nft.contractAddress,
    );
    const tokenIdsGivenByA = sufficientNFTsA.map((nft) => nft.tokenId);

    const nftContractsGivenByB: AddressLike[] = [];
    const tokenIdsGivenByB: BigNumberish[] = [];

    // 제안 등록 유저의 NFT 부족 확인
    // 이 경우, 모든 NFT 를 체크하지 않고, 하나라도 부족하면 바로 에러를 던짐
    for (const nft of offerEntity.offeredNfts) {
      const results = await this.checkSingleNFTAvailability(
        offerEntity.offerorUserId,
        nft,
      );

      if (!results.hasEnough) {
        // 제안 취소
        await this.nftExchangeRepositoryService.save({
          ...offerEntity,
          status: NftExchangeOfferStatus.SYSTEM_CANCELLED,
        });
        throw new NFTBalanceChangedError();
      }
      nftContractsGivenByB.push(
        ...results.nfts.map((nft) => nft.contractAddress),
      );
      tokenIdsGivenByB.push(...results.nfts.map((nft) => nft.tokenId));
    }

    return {
      nftContractsGivenByA,
      tokenIdsGivenByA,
      nftContractsGivenByB,
      tokenIdsGivenByB,
      userA,
      userB,
    };
  }

  private async checkNFTBalance(
    userId: number,
    nfts: NFTAsset[],
  ): Promise<{
    sufficientNFTs: { contractAddress: AddressLike; tokenId: BigNumberish }[];
    insufficientNFTs: NFTCheckResult[];
  }> {
    const checkPromises = nfts.map((nft) =>
      this.checkSingleNFTAvailability(userId, nft),
    );
    const results = await Promise.all(checkPromises);

    const sufficientNFTs: {
      contractAddress: AddressLike;
      tokenId: BigNumberish;
    }[] = [];
    const insufficientNFTs: NFTCheckResult[] = [];

    results.forEach((result) => {
      if (result.insufficientNFT) {
        insufficientNFTs.push(result.insufficientNFT);
      } else {
        sufficientNFTs.push(...result.nfts);
      }
    });

    return { sufficientNFTs, insufficientNFTs };
  }

  private async checkSingleNFTAvailability(
    userId: number,
    nft: NFTAsset,
  ): Promise<{
    hasEnough: boolean;
    nfts: { contractAddress: AddressLike; tokenId: BigNumberish }[];
    insufficientNFT?: NFTCheckResult;
  }> {
    let userNfts: (
      | UserMaterialItemEntity
      | BlueprintItemEntity
      | PuzzlePieceEntity
    )[] = [];
    let sufficientNFTs: {
      contractAddress: AddressLike;
      tokenId: BigNumberish;
    }[] = [];

    let insufficientNFT: NFTCheckResult | undefined;
    let hasEnough: boolean = false;
    if (nft.type == NFTType.Material) {
      userNfts =
        await this.itemRepositoryService.findUserMaterialItemsByContractId(
          userId,
          nft.contractId,
        );
      if (userNfts.length >= nft.quantity) {
        hasEnough = true;
        sufficientNFTs = userNfts
          .slice(0, nft.quantity)
          .map((item: UserMaterialItemEntity) => {
            return {
              contractAddress: item.materialItem.contract.address,
              tokenId: item.tokenId,
            };
          });
      } else {
        insufficientNFT = {
          name: userNfts.length
            ? (userNfts[0] as UserMaterialItemEntity).materialItem.nameKr
            : 'Material',
          required: nft.quantity,
          available: userNfts.length,
        };
      }
    } else if (nft.type === NFTType.Blueprint) {
      userNfts =
        await this.itemRepositoryService.findUserBlueprintItemsBySeasonZoneId(
          userId,
          nft.seasonZoneId,
        );
      if (userNfts.length >= nft.quantity) {
        hasEnough = true;
        sufficientNFTs = userNfts
          .slice(0, nft.quantity)
          .map((item: BlueprintItemEntity) => {
            return {
              contractAddress: item.metadata.contract.address,
              tokenId: item.metadata.tokenId,
            };
          });
      } else {
        insufficientNFT = {
          name: userNfts.length
            ? (userNfts[0] as UserMaterialItemEntity).materialItem.nameKr
            : 'Blueprint', // TODO: 필요하면 더 자세한 정보로 변경
          required: nft.quantity,
          available: userNfts.length,
        };
      }
    } else if (nft.type === NFTType.PuzzlePiece) {
      userNfts = await this.puzzleRepositoryService.getUserPiecesBySeasonZoneId(
        userId,
        nft.seasonZoneId,
      );

      if (userNfts.length >= nft.quantity) {
        hasEnough = true;
        sufficientNFTs = userNfts
          .slice(0, nft.quantity)
          .map((piece: PuzzlePieceEntity) => {
            return {
              contractAddress: piece.metadata.contract.address,
              tokenId: piece.metadata.tokenId,
            };
          });
      } else {
        insufficientNFT = {
          name:
            (userNfts[0] as PuzzlePieceEntity).metadata.metadata.name ??
            'Puzzle Piece', // TODO: 필요하면 더 자세한 정보로 변경
          required: nft.quantity,
          available: userNfts.length,
        };
      }
    }

    return { hasEnough, nfts: sufficientNFTs, insufficientNFT };
  }
}
