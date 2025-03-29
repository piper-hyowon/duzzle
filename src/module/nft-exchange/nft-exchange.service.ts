import { SmartContractInteractionService } from './../blockchain/smart-contract-interaction.service';
import { Injectable } from '@nestjs/common';
import { NftExchangeRepositoryService } from '../repository/service/nft-exchange.repository.service';
import { PaginatedList } from 'src/dto/response.dto';
import { AvailableNftsToRequestRequest } from './dto/available-nfts-to-request.dto';
import { AvailableNftDto } from './dto/available-nfts.dto';
import {
  NftExchangeListRequest,
  PostNftExchangeRequest,
} from './dto/nft-exchange.dto';
import { NftRepositoryService } from '../repository/service/nft.repository.service';
import { ContractKey } from '../repository/enum/contract.enum';
import { NFTType } from './domain/nft-asset';
import { ZoneRepositoryService } from '../repository/service/zone.repository.service';
import { ContentNotFoundError } from 'src/types/error/application-exceptions/404-not-found';
import { NftExchangeOfferStatus } from '../repository/enum/nft-exchange-status.enum';
import { AccessDenied } from 'src/types/error/application-exceptions/403-forbidden';
import { ActionNotPermittedError } from 'src/types/error/application-exceptions/409-conflict';
import { SelfAcceptForbidden } from 'src/types/error/application-exceptions/403-forbidden';
import { NftExchangeMappingService } from './nft-exchange-mapping.service';
import { NftExchangeOfferResponse } from './dto/nft-exchange-offer.dto';
import { NftExchangeOfferDetailResponse } from './dto/nft-exchange-offer-detail.dto';

@Injectable()
export class NftExchangeService {
  constructor(
    private readonly zoneRepositoryService: ZoneRepositoryService,

    private readonly nftRepositoryService: NftRepositoryService,

    private readonly nftExchangeRepositoryService: NftExchangeRepositoryService,

    private readonly smartContractInteractionService: SmartContractInteractionService,

    private readonly nftExchangeMappingService: NftExchangeMappingService,
  ) {}

  async getAvailableNFTsToOffer(
    userId: number,
    userWallet: string,
  ): Promise<AvailableNftDto[]> {
    return this.nftExchangeRepositoryService.getAvailableNFTsToOffer(
      userId,
      userWallet,
    );
  }

  async getAvailableNFTsToRequest(
    params: AvailableNftsToRequestRequest,
  ): Promise<PaginatedList<AvailableNftDto>> {
    return this.nftExchangeRepositoryService.getAvailableNFTsToRequestPaginated(
      params,
    );
  }

  async postNftExchange(
    userId: number,
    params: PostNftExchangeRequest,
  ): Promise<void> {
    const Nfts = [...params.offeredNfts, ...params.requestedNfts];
    const seasonZoneIds = (
      await this.zoneRepositoryService.getSeasonZones()
    ).map((zone) => zone.id);

    for (const nft of Nfts) {
      if (nft.type === NFTType.Material) {
        const contract = await this.nftRepositoryService.findContractById(
          nft.contractId,
        );
        if (!contract || contract.key !== ContractKey.ITEM_MATERIAL) {
          throw new ContentNotFoundError('contract', nft.contractId);
        }
      } else if (
        nft.type === NFTType.Blueprint ||
        nft.type === NFTType.PuzzlePiece
      ) {
        if (!seasonZoneIds.includes(nft.seasonZoneId)) {
          throw new ContentNotFoundError('seasonZone', nft.seasonZoneId);
        }
      }
    }

    await this.nftExchangeRepositoryService.postNftExchange({
      offerorUserId: userId,
      ...params,
    });
  }

  async deleteNftExchange(
    userId: number,
    nftExchangeId: number,
  ): Promise<void> {
    const nftExchange =
      await this.nftExchangeRepositoryService.findNftExchangeById(
        nftExchangeId,
      );

    if (!nftExchange) {
      throw new ContentNotFoundError('nft-exchange-offer', nftExchangeId);
    }
    if (nftExchange.offerorUserId !== userId) {
      throw new AccessDenied('nft-exchange-offer', nftExchangeId);
    }

    if (nftExchange.status !== NftExchangeOfferStatus.LISTED) {
      throw new ActionNotPermittedError(
        'cancel',
        'nft-exchange-offer',
        nftExchange.status,
      );
    }

    await this.nftExchangeRepositoryService.deleteNftExchange(nftExchangeId);
  }

  async getNftExchangeList(
    params: NftExchangeListRequest,
    userId?: number,
  ): Promise<PaginatedList<NftExchangeOfferResponse>> {
    return await this.nftExchangeRepositoryService.getNftExchangeOffersPaginated(
      params,
      userId,
    );
  }

  async acceptNftExchange(
    acceptorId: number,
    exchangeOfferId: number,
  ): Promise<boolean> {
    let exchangeOffer =
      await this.nftExchangeRepositoryService.getOfferById(exchangeOfferId);

    if (exchangeOffer.offerorUserId === acceptorId) {
      throw new SelfAcceptForbidden();
    }

    if (exchangeOffer.status !== NftExchangeOfferStatus.LISTED) {
      throw new ActionNotPermittedError(
        '교환 제안 수락',
        '교환 제안 상태',
        exchangeOffer.status,
      );
    }

    exchangeOffer = await this.nftExchangeRepositoryService.save({
      ...exchangeOffer,
      acceptorUserId: acceptorId,
      status: NftExchangeOfferStatus.MATCHED,
    });

    let contractParams;

    try {
      contractParams =
        await this.nftExchangeMappingService.mapEntityToTokenIds(exchangeOffer);
    } catch (error) {
      await this.nftExchangeRepositoryService.save({
        ...exchangeOffer,
        status: NftExchangeOfferStatus.LISTED,
        acceptorUserId: null,
      });
      throw error;
    }

    // NFTSwap 컨트랙트의 executeNFTSwap 함수 호출
    exchangeOffer.status = NftExchangeOfferStatus.PENDING;
    await this.nftExchangeRepositoryService.save(exchangeOffer);
    const { success, transactionHash, failureReason } =
      await this.smartContractInteractionService.nftSwap(
        contractParams.nftContractsGivenByA,
        contractParams.tokenIdsGivenByA,
        contractParams.nftContractsGivenByB,
        contractParams.tokenIdsGivenByB,
        contractParams.userA,
        contractParams.userB,
      );

    if (success) {
      exchangeOffer.status = NftExchangeOfferStatus.COMPLETED;
      exchangeOffer.transactionHash = transactionHash;
    } else {
      exchangeOffer.status = NftExchangeOfferStatus.FAILED;
      exchangeOffer.failureReason = failureReason;
    }

    await this.nftExchangeRepositoryService.save(exchangeOffer);

    return success;
  }

  async getNftExchangeById(
    id: number,
  ): Promise<NftExchangeOfferDetailResponse> {
    return this.nftExchangeRepositoryService.getNftExchangeOfferById(id);
  }
}
