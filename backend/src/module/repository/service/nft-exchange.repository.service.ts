import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, Repository } from 'typeorm';
import {
  AvailableBlueprintOrPuzzleNFT,
  AvailableMaterialNFT,
  AvailableNftDto,
} from 'src/module/nft-exchange/dto/available-nfts.dto';
import { UserMaterialItemEntity } from '../entity/user-material-item.entity';
import { BlueprintItemEntity } from '../entity/blueprint-item.entity';
import { SeasonZoneEntity } from '../entity/season-zone.entity';
import { PuzzlePieceEntity } from '../entity/puzzle-piece.entity';
import { MaterialItemEntity } from '../entity/material-item.entity';
import { ZoneEntity } from '../entity/zone.entity';
import { SeasonEntity } from '../entity/season.entity';
import { NFTAsset, NFTType } from 'src/module/nft-exchange/domain/nft-asset';
import { BLUEPRINT_ITEM_IMAGE_URL } from 'src/constant/item';
import { PaginatedList } from 'src/dto/response.dto';
import { AvailableNftsToRequestRequest } from 'src/module/nft-exchange/dto/available-nfts-to-request.dto';
import { NftExchangeOfferEntity } from '../entity/nft-exchange-offers.entity';
import { NftExchangeOfferDto } from '../dto/nft-exchange.dto';
import { UserEntity } from '../entity/user.entity';
import {
  ExchangeBlueprintOrPuzzleNFT,
  ExchangeMaterialNFT,
  NftExchangeOfferResponse,
} from 'src/module/nft-exchange/dto/nft-exchange-offer.dto';
import { NftExchangeListRequest } from 'src/module/nft-exchange/dto/nft-exchange.dto';
import { NftExchangeOfferStatus } from '../enum/nft-exchange-status.enum';
import { NftExchangeOfferDetailResponse } from 'src/module/nft-exchange/dto/nft-exchange-offer-detail.dto';
import { BLOCK_EXPLORER_URL } from 'src/constant/nft-exchange';
import { NftMetadataEntity } from '../entity/nft-metadata.entity';
import { ContentNotFoundError } from 'src/types/error/application-exceptions/404-not-found';
import { ContractEntity } from '../entity/contract.entity';
import { NftRepositoryService } from './nft.repository.service';
import { ContractKey } from '../enum/contract.enum';

@Injectable()
export class NftExchangeRepositoryService {
  constructor(
    @InjectRepository(SeasonZoneEntity)
    private seasonZoneRepository: Repository<SeasonZoneEntity>,

    @InjectRepository(NftExchangeOfferEntity)
    private nftExchangeOfferRepository: Repository<NftExchangeOfferEntity>,

    @InjectRepository(MaterialItemEntity)
    private materialItemRepository: Repository<MaterialItemEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(UserMaterialItemEntity)
    private userMaterialItemRepository: Repository<UserMaterialItemEntity>,

    @InjectRepository(BlueprintItemEntity)
    private blueprintItemRepository: Repository<BlueprintItemEntity>,

    @InjectRepository(PuzzlePieceEntity)
    private puzzlePieceRepository: Repository<PuzzlePieceEntity>,

    private readonly nftRepositoryService: NftRepositoryService,

    private readonly entityManager: EntityManager,
  ) {}

  async findNftExchangeById(
    nftExchangeId: number,
  ): Promise<NftExchangeOfferEntity> {
    const nftExchange = await this.nftExchangeOfferRepository.findOneBy({
      id: nftExchangeId,
    });

    return nftExchange;
  }

  async getOfferById(id: number): Promise<NftExchangeOfferEntity> {
    const offer = await this.nftExchangeOfferRepository.findOne({
      where: { id },
      relations: {
        offeror: true,
        acceptor: true,
      },
    });
    if (!offer) {
      throw new ContentNotFoundError('NftExchangeOffer', id);
    }

    return offer;
  }

  async postNftExchange(
    dto: NftExchangeOfferDto,
  ): Promise<NftExchangeOfferEntity> {
    const entity = this.nftExchangeOfferRepository.create(dto);
    await this.nftExchangeOfferRepository.save(entity);

    return entity;
  }

  async getNftExchangeOffersPaginated(
    params: NftExchangeListRequest,
    userId?: number,
  ): Promise<PaginatedList<NftExchangeOfferResponse>> {
    const { page, count } = params;
    const offset = page * count;

    const { status, requestedNfts, offeredNfts, offerorUser } = params;

    const getExchangeOfferIds = async (
      name: string,
      type: 'requestedNfts' | 'offeredNfts',
    ) => {
      const materialItems = await this.materialItemRepository.findBy({
        nameKr: ILike(`%${name}%`),
      });
      const contractIds = materialItems.map((item) => item.contractId);

      const seasonZones = await this.seasonZoneRepository
        .createQueryBuilder('sz')
        .innerJoinAndSelect('sz.season', 'season')
        .innerJoinAndSelect('sz.zone', 'zone')
        .where('season.titleKr ILIKE :titleKr', { titleKr: `%${name}%` })
        .orWhere('zone.nameKr ILIKE :nameKr', { nameKr: `%${name}%` })
        .select('sz.id')
        .getMany();
      const seasonZoneIds = seasonZones.map((zone) => zone.id);

      const queryBuilder =
        await this.nftExchangeOfferRepository.createQueryBuilder('neo');
      if (contractIds.length === 0 && seasonZoneIds.length === 0) {
        queryBuilder.where('false');
      }
      if (contractIds.length > 0) {
        queryBuilder.orWhere(
          `EXISTS (
            SELECT 1
            FROM jsonb_array_elements(neo.${type}) AS elem
            WHERE elem->>'type' = :nftType AND elem->>'contractId' IN (:...contractIds)
          )`,
          { contractIds, nftType: NFTType.Material },
        );
      }
      if (seasonZoneIds.length > 0) {
        queryBuilder.orWhere(
          `EXISTS (
            SELECT 1
            FROM jsonb_array_elements(neo.${type}) AS elem
            WHERE elem->>'type' IN (:...nftTypes) AND elem->>'seasonZoneId' IN (:...seasonZoneIds)
          )`,
          { seasonZoneIds, nftTypes: [NFTType.Blueprint, NFTType.PuzzlePiece] },
        );
      }

      const exchangeOfferIds = await queryBuilder.select('neo.id').getMany();
      return exchangeOfferIds.map((offer) => offer.id);
    };

    let condition: string[] = ['TRUE'];
    if (status) {
      condition.push(`status = '${status}'`);
    }
    if (requestedNfts) {
      const offerIds = await getExchangeOfferIds(
        requestedNfts,
        'requestedNfts',
      );
      if (offerIds.length === 0) {
        return { list: [], total: 0 };
      }
      condition.push(`id IN (${offerIds})`);
    }
    if (offeredNfts) {
      const offerIds = await getExchangeOfferIds(offeredNfts, 'offeredNfts');
      if (offerIds.length === 0) {
        return { list: [], total: 0 };
      }
      condition.push(`id IN (${offerIds})`);
    }
    if (offerorUser) {
      const users = await this.userRepository.findBy({
        name: ILike(`%${offerorUser}%`),
      });
      const userWalletAddress = users
        ? users.map((u) => `'${u.walletAddress}'`)
        : [];
      if (userWalletAddress.length === 0) {
        return { list: [], total: 0 };
      }
      condition.push(
        `"offerorUser"->>'walletAddress' IN (${userWalletAddress})`,
      );
    }
    if (userId) {
      const user = await this.userRepository.findOneBy({ id: userId });
      const walletAddress = user.walletAddress;
      condition.push(`"offerorUser"->>'walletAddress' = '${walletAddress}'`);
    }

    const innerQuery = this.getNftExchangeOffer();

    const query = `
      SELECT * FROM (${innerQuery}) AS offer
      WHERE ${condition.join(' AND ')}
      ORDER BY
        CASE
          WHEN status = '${NftExchangeOfferStatus.LISTED}' THEN 0
          ELSE 1
        END ASC,
        "createdAt" DESC
      LIMIT ${count} OFFSET ${offset}`;

    const countQuery = `
      SELECT COUNT(*) AS total FROM (${innerQuery}) AS count_query
      WHERE ${condition.join(' AND ')}`;

    const [list, total] = await Promise.all([
      this.entityManager.query(query),
      this.entityManager.query(countQuery),
    ]);

    return {
      list,
      total: parseInt(total[0].total),
    };
  }

  async getNftExchangeOfferById(
    offerId: number,
  ): Promise<NftExchangeOfferDetailResponse> {
    const getHistory = async (
      nft: ExchangeBlueprintOrPuzzleNFT | ExchangeMaterialNFT,
      walletAddress: string,
    ) => {
      const user = await this.userRepository.findOneBy({ walletAddress });
      if (!user) return nft;

      const userId = user.id;

      const historyQuery = async (tokenId: string, contractAddress: string) => {
        const result = await this.entityManager.query(
          `
            SELECT json_agg(json_build_object(
              'event', lt.topic,
              'date', lt.created_at,
              'to', ut.name,
              'toWalletAddress', lt.to,
              'from', uf.name,
              'fromWalletAddress', lt.from,
              'blockExplorerUrl', concat($1::text, lt.transaction_hash)
            ) ORDER BY lt.created_at)
            FROM log_transaction AS lt
            LEFT JOIN "user" AS ut ON lt.to = ut.wallet_address
            LEFT JOIN "user" AS uf ON lt.from = uf.wallet_address
            WHERE lt.token_id = $2 and lt.contract_address = $3
          `,
          [BLOCK_EXPLORER_URL, tokenId, contractAddress],
        );

        return result[0].json_agg;
      };

      let query;

      if (nft.type === NFTType.Material) {
        query = this.userMaterialItemRepository
          .createQueryBuilder('umi')
          .select([
            'umi.tokenId AS "tokenId"',
            'c.address as "contractAddress"',
          ])
          .innerJoin(MaterialItemEntity, 'mi', 'umi.materialItemId = mi.id')
          .innerJoin(ContractEntity, 'c', 'mi.contractId = c.id')
          .where('umi.userId = :userId', { userId })
          .andWhere('mi.nameKr = :name', {
            name: nft.name,
          });
      } else if (nft.type === NFTType.Blueprint) {
        const contractAddress = (
          await this.nftRepositoryService.findContractByKey(
            ContractKey.ITEM_BLUEPRINT,
          )
        ).address;
        query = this.blueprintItemRepository
          .createQueryBuilder('bi')
          .select([
            'n.tokenId AS "tokenId"',
            `'${contractAddress}' as "contractAddress"`,
          ])
          .innerJoin(NftMetadataEntity, 'n', 'bi.nftMetadataId = n.id')
          .where('bi.userId = :userId', { userId });
      } else if (nft.type === NFTType.PuzzlePiece) {
        const contractAddress = (
          await this.nftRepositoryService.findContractByKey(
            ContractKey.PUZZLE_PIECE,
          )
        ).address;
        query = this.puzzlePieceRepository
          .createQueryBuilder('pp')
          .select([
            'n.tokenId AS "tokenId"',
            `'${contractAddress}' as "contractAddress"`,
          ])
          .innerJoin(NftMetadataEntity, 'n', 'pp.nftMetadataId = n.id')
          .where('pp.holerWalletAddress = :walletAddress', { walletAddress });
      }

      const result = await query.execute();

      return {
        ...nft,
        availableNfts: await Promise.all(
          result.map(async (result) => {
            const { tokenId, contractAddress } = result;
            const history = await historyQuery(tokenId, contractAddress);
            return { tokenId, history };
          }),
        ),
      };
    };

    const innerQuery = this.getNftExchangeOffer();
    const result = await this.entityManager
      .createQueryBuilder()
      .select('*')
      .from(`(${innerQuery})`, 'offer')
      .where('offer.id = :offerId', { offerId })
      .getRawOne();

    if (!result) {
      throw new ContentNotFoundError('nftExchangeOffer', offerId);
    }

    return {
      ...result,
      offeredNfts: await Promise.all(
        result.offeredNfts.map((nft) => {
          return getHistory(nft, result.offerorUser.walletAddress);
        }),
      ),
    };
  }

  private getNftExchangeOffer(): string {
    const query = `
      with requestedNfts as (
        select
          neo.id,
          json_agg(
            case
              when nfts->>'type'='${NFTType.Material}' then json_build_object(
                'type', nfts->>'type',
                'name', mi.name_kr,
                'image', mi.image_url,
                'quantity', (nfts->>'quantity')::integer
              )
              when nfts->>'type' in('${NFTType.Blueprint}', '${NFTType.PuzzlePiece}') then json_build_object(
                'type', nfts->>'type',
                'seasonName', s.title_kr,
                'zoneName', z.name_kr,
                'image',
                  case
                    when nfts->>'type' = '${NFTType.PuzzlePiece}' then sz.puzzle_thumbnail_url
                    when nfts->>'type' = '${NFTType.Blueprint}' then '${BLUEPRINT_ITEM_IMAGE_URL}'
                  end,
                'quantity', (nfts->>'quantity')::integer
              )
            end
          ) as requestedNfts
        from nft_exchange_offers as neo
        left join jsonb_array_elements(neo.requested_nfts) as nfts on true
        left join (
          select distinct on (contract_id) * from material_item
        ) as mi on (nfts->>'contractId')::integer = mi.contract_id
        left join season_zone as sz on (nfts->>'seasonZoneId')::integer = sz.id
        left join season as s on sz.season_id = s.id
        left join zone as z on sz.zone_id = z.id
        group by neo.id
      ),
      offeredNfts as (
        select
          neo.id,
          json_agg(
            case
              when nfts->>'type'='${NFTType.Material}' then json_build_object(
                'type', nfts->>'type',
                'name', mi.name_kr,
                'image', mi.image_url,
                'quantity', (nfts->>'quantity')::integer
              )
              when nfts->>'type' in('${NFTType.Blueprint}', '${NFTType.PuzzlePiece}') then json_build_object(
                'type', nfts->>'type',
                'seasonName', s.title_kr,
                'zoneName', z.name_kr,
                'image',
                  case
                    when nfts->>'type' = '${NFTType.PuzzlePiece}' then sz.puzzle_thumbnail_url
                    when nfts->>'type' = '${NFTType.Blueprint}' then '${BLUEPRINT_ITEM_IMAGE_URL}'
                  end,
                'quantity', (nfts->>'quantity')::integer
              )
            end
          ) as offeredNfts
        from nft_exchange_offers as neo
        left join jsonb_array_elements(neo.offered_nfts) as nfts on true
        left join (
          select distinct on (contract_id) * from material_item
        ) as mi on (nfts->>'contractId')::integer = mi.contract_id
        left join season_zone as sz on (nfts->>'seasonZoneId')::integer = sz.id
        left join season as s on sz.season_id = s.id
        left join zone as z on sz.zone_id = z.id
        group by neo.id
      )
      select 
        neo.id,
        neo.status,
        neo.created_at as "createdAt",
        json_build_object(
          'walletAddress', u.wallet_address,
          'name', u.name,
          'image', u.image
        ) as "offerorUser",
        o.offeredNfts as "offeredNfts",
        r.requestedNfts as "requestedNfts"
      from nft_exchange_offers as neo
      left join "user" as u on neo.offeror_user_id = u.id
      left join requestedNfts as r on neo.id = r.id
      left join offeredNfts as o on neo.id = o.id
    `;

    return query;
  }

  async deleteNftExchange(nftExchangeId: number): Promise<void> {
    await this.nftExchangeOfferRepository.delete(nftExchangeId);
  }

  async getAvailableNFTsToOffer(
    userId: number,
    userWalletAddress: string,
  ): Promise<AvailableNftDto[]> {
    const [materialNFTs, blueprintNFTs, puzzleNFTs] = await Promise.all([
      // 1. 사용자의 material NFT 조회
      this.userMaterialItemRepository
        .createQueryBuilder('umi')
        .select([
          'count(*) as "availableQuantity"',
          'mi.name_kr AS name',
          'mi.image_url AS "imageUrl"',
          'mi.contract_id AS "contractId"',
        ])
        .innerJoin(MaterialItemEntity, 'mi', 'umi.materialItemId = mi.id')
        .where('umi.userId = :userId', { userId })
        .groupBy('umi.material_item_id')
        .addGroupBy('mi.name_kr')
        .addGroupBy('mi.image_url')
        .addGroupBy('mi.contract_id')
        .execute(),

      // 2. 사용자의 blueprint NFT 조회
      this.blueprintItemRepository
        .createQueryBuilder('bi')
        .select([
          'sz.id AS "seasonZoneId"',
          's.title AS "seasonName"',
          'z.nameKr AS "zoneName"',
          'count(*) as "availableQuantity"',
        ])
        .innerJoin(SeasonZoneEntity, 'sz', 'bi.seasonZoneId = sz.id')
        .innerJoin(ZoneEntity, 'z', 'sz.zoneId = z.id')
        .innerJoin(SeasonEntity, 's', 'sz.seasonId = s.id')
        .where('bi.userId = :userId', { userId })
        // .andWhere('sz.seasonId = (select max(id) from season)')
        .andWhere('bi.minted')
        .andWhere('bi.burned = false')
        .groupBy('z.nameKr')
        .addGroupBy('sz.id')
        .addGroupBy('s.title')
        .execute(),

      // 3. 사용자의 puzzle piece NFT 조회
      this.puzzlePieceRepository
        .createQueryBuilder('pp')
        .select([
          'sz.id AS "seasonZoneId"',
          's.title AS "seasonName"',
          'z.nameKr AS "zoneName"',
          'count(*) as "availableQuantity"',
          'sz.puzzleThumbnailUrl AS "imageUrl"',
        ])
        .innerJoin(SeasonZoneEntity, 'sz', 'pp.seasonZoneId = sz.id')
        .innerJoin(ZoneEntity, 'z', 'sz.zoneId = z.id')
        .innerJoin(SeasonEntity, 's', 'sz.seasonId = s.id')
        .where('pp.holerWalletAddress = :userWalletAddress', {
          userWalletAddress,
        })
        .andWhere('pp.minted')
        // .andWhere('pp.burned = false') // TODO: 현재는 burn 기능이 없어서 미사용
        .groupBy('z.nameKr')
        .addGroupBy('sz.id')
        .addGroupBy('s.title')
        .addGroupBy('sz.puzzleThumbnailUrl')
        .execute(),
    ]);

    return [
      ...materialNFTs.map((e) => {
        return {
          type: NFTType.Material,
          nftInfo: <AvailableMaterialNFT>{
            contractId: parseInt(e.contractId),
            name: e.name,
            imageUrl: e.imageUrl,
            availableQuantity: parseInt(e.availableQuantity),
          },
        };
      }),
      ...blueprintNFTs.map((e) => {
        return {
          type: NFTType.Blueprint,
          nftInfo: {
            seasonZoneId: parseInt(e.seasonZoneId),
            seasonName: e.seasonName,
            zoneName: e.zoneName,
            imageUrl: BLUEPRINT_ITEM_IMAGE_URL,
            availableQuantity: parseInt(e.availableQuantity),
          },
        };
      }),
      ...puzzleNFTs.map((e) => {
        return {
          type: NFTType.PuzzlePiece,
          nftInfo: {
            seasonZoneId: parseInt(e.seasonZoneId),
            seasonName: e.seasonName,
            zoneName: e.zoneName,
            imageUrl: e.imageUrl,
            availableQuantity: parseInt(e.availableQuantity),
          },
        };
      }),
    ];
  }

  private createUnionQuery(name: string | undefined): [string, any[]] {
    const parameters: any[] = [];
    let parameterIndex = 1;

    const materialNameCondition = name
      ? `AND mi.name_kr ILIKE $${parameterIndex++}`
      : '';
    const blueprintPuzzleNameCondition = name
      ? `AND (z.name_kr ILIKE $${parameterIndex++} OR s.title ILIKE $${parameterIndex++})`
      : '';

    if (name) {
      parameters.push(`%${name}%`, `%${name}%`, `%${name}%`);
    }

    const query = `
      SELECT 
        count(*) as "availableQuantity",
        mi.name_kr AS name,
        mi.image_url AS "imageUrl",
        mi.contract_id AS "contractId",
        NULL AS "seasonZoneId",
        NULL AS "seasonName",
        '${NFTType.Material}' AS type
      FROM user_material_item umi
      INNER JOIN material_item mi ON umi.material_item_id = mi.id
      WHERE 1=1 ${materialNameCondition}
      GROUP BY umi.material_item_id, mi.name_kr, mi.image_url, mi.contract_id
  
      UNION ALL
  
      SELECT 
        count(*) as "availableQuantity",
        z.name_kr AS name,
        '${BLUEPRINT_ITEM_IMAGE_URL}' AS "imageUrl",
        NULL AS "contractId",
        sz.id AS "seasonZoneId",
        s.title AS "seasonName",
        '${NFTType.Blueprint}' AS type
      FROM blueprint_item bi
      INNER JOIN season_zone sz ON bi.season_zone_id = sz.id
      INNER JOIN zone z ON sz.zone_id = z.id
      INNER JOIN season s ON sz.season_id = s.id
      WHERE bi.user_id IS NOT NULL
        AND bi.minted = true
        AND bi.burned = false
        ${blueprintPuzzleNameCondition}
      GROUP BY z.name_kr, sz.id, s.title
  
      UNION ALL
  
      SELECT 
        count(*) as "availableQuantity",
        z.name_kr AS name,
        sz.puzzle_thumbnail_url AS "imageUrl",
        NULL AS "contractId",
        sz.id AS "seasonZoneId",
        s.title AS "seasonName",
        '${NFTType.PuzzlePiece}' AS type
      FROM puzzle_piece pp
      INNER JOIN season_zone sz ON pp.season_zone_id = sz.id
      INNER JOIN zone z ON sz.zone_id = z.id
      INNER JOIN season s ON sz.season_id = s.id
      WHERE pp.holer_wallet_address IS NOT NULL
        AND pp.minted = true
        ${blueprintPuzzleNameCondition}
      GROUP BY z.name_kr, sz.id, s.title, sz.puzzle_thumbnail_url
    `;

    return [query, parameters];
  }

  async getAvailableNFTsToRequestPaginated(
    params: AvailableNftsToRequestRequest,
  ): Promise<PaginatedList<AvailableNftDto>> {
    const { page, count, name } = params;
    const offset = page * count;

    const [innerQuery, parameters] = this.createUnionQuery(name);

    const query = `
      SELECT * FROM (
        ${innerQuery}
      ) AS combined_results
      ORDER BY 
        CASE 
          WHEN type = '${NFTType.Material}' THEN 0 
          WHEN type = '${NFTType.Blueprint}' THEN 1
          WHEN type = '${NFTType.PuzzlePiece}' THEN 2
          ELSE 3
        END,
        name
      LIMIT $${parameters.length + 1} OFFSET $${parameters.length + 2}
    `;

    const countQuery = `SELECT COUNT(*) as total FROM (${innerQuery}) as count_query`;

    const [items, totalCountResult] = await Promise.all([
      this.entityManager.query(query, [...parameters, count, offset]),
      this.entityManager.query(countQuery, parameters),
    ]);

    const total = parseInt(totalCountResult[0].total);
    const list = this.mapResultsToDto(items);

    return {
      list,
      total,
    };
  }

  private mapResultsToDto(results: any[]): AvailableNftDto[] {
    return results.map((result) => ({
      type: result.type as NFTType,
      nftInfo:
        result.type === NFTType.Material
          ? <AvailableMaterialNFT>{
              contractId: result.contractId
                ? parseInt(result.contractId)
                : null,
              name: result.name,
              imageUrl: result.imageUrl,
              availableQuantity: parseInt(result.availableQuantity),
            }
          : <AvailableBlueprintOrPuzzleNFT>{
              seasonZoneId: result.seasonZoneId
                ? parseInt(result.seasonZoneId)
                : null,
              seasonName: result.seasonName,
              zoneName: result.name,
              imageUrl: result.imageUrl,
              availableQuantity: parseInt(result.availableQuantity),
            },
    }));
  }

  async save(entity: NftExchangeOfferEntity): Promise<NftExchangeOfferEntity> {
    await this.nftExchangeOfferRepository.save(entity);
    return this.nftExchangeOfferRepository.findOne({
      relations: {
        offeror: true,
        acceptor: true,
      },
      where: { id: entity.id },
    });
  }
}
