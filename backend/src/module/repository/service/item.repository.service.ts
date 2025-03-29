import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MaterialItemEntity } from '../entity/material-item.entity';
import { BlueprintItemEntity } from '../entity/blueprint-item.entity';
import { UserMaterialItemEntity } from '../entity/user-material-item.entity';
import { Item } from 'src/module/item/dto/item.dto';
import { SeasonZoneEntity } from '../entity/season-zone.entity';
import { ZoneEntity } from '../entity/zone.entity';
import { UserBlueprintItemsDto } from '../dto/item.dto';
import { UserEntity } from '../entity/user.entity';
import { NULL_ADDRESS } from 'src/module/blockchain/dto/blockchain.dto';

@Injectable()
export class ItemRepositoryService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(MaterialItemEntity)
    private materialItemRepository: Repository<MaterialItemEntity>,

    @InjectRepository(UserMaterialItemEntity)
    private userMaterialItemRepository: Repository<UserMaterialItemEntity>,

    @InjectRepository(BlueprintItemEntity)
    private blueprintItemRepository: Repository<BlueprintItemEntity>,
  ) {}

  async getUserMaterialItemTotals(userId: number): Promise<number> {
    const materialTotals = await this.userMaterialItemRepository.countBy({
      userId,
    });

    return materialTotals;
  }

  async getUserBlueprintItemTotalsBySeasonId(
    userId: number,
    seasonId: number,
  ): Promise<number> {
    const blueprintTotals = await this.blueprintItemRepository.count({
      relations: ['seasonZone', 'seasonZone.season'],
      where: {
        userId,
        burned: false,
        seasonZone: {
          season: {
            id: seasonId,
          },
        },
      },
    });

    return blueprintTotals;
  }

  async findUserMaterialItems(userId: number): Promise<Item[]> {
    const userMaterialItems = await this.userMaterialItemRepository
      .createQueryBuilder('ui')
      .select(['count(*)', 'mi.name_kr AS name', 'mi.image_url AS image'])
      .innerJoin(MaterialItemEntity, 'mi', 'ui.materialItemId = mi.id')
      .where('ui.userId = :userId', { userId })
      .groupBy('ui.material_item_id')
      .addGroupBy('mi.name_kr')
      .addGroupBy('mi.image_url')
      .execute();

    return userMaterialItems.map((e) => {
      return {
        ...e,
        count: parseInt(e.count),
      };
    });
  }

  async findUserMaterialItemsByContractId(
    userId: number,
    contractId: number,
  ): Promise<UserMaterialItemEntity[]> {
    return this.userMaterialItemRepository.find({
      relations: {
        materialItem: {
          contract: true,
        },
      },
      where: { userId, materialItem: { contract: { id: contractId } } },
    });
  }

  async findUserBlueprintItems(
    userId: number,
  ): Promise<UserBlueprintItemsDto[]> {
    const userBlueprintItems: UserBlueprintItemsDto[] =
      await this.blueprintItemRepository
        .createQueryBuilder('bi')
        .select(['z.nameKr AS zone', 'count(*)'])
        .innerJoin(SeasonZoneEntity, 'sz', 'bi.seasonZoneId = sz.id')
        .innerJoin(ZoneEntity, 'z', 'sz.zoneId = z.id')
        .where('bi.userId = :userId', { userId })
        .andWhere('sz.seasonId = (select max(id) from season)')
        .andWhere('bi.minted')
        .andWhere('bi.burned = false')
        .groupBy('z.nameKr')
        .execute();

    return userBlueprintItems;
  }

  async findUserBlueprintItemsBySeasonZoneId(
    userId: number,
    seasonZoneId: number,
  ): Promise<BlueprintItemEntity[]> {
    return this.blueprintItemRepository.find({
      relations: {
        metadata: {
          contract: true,
        },
      },
      where: {
        userId,
        burned: false,
        minted: true,
        seasonZoneId,
      },
    });
  }

  private async nullifyBurnedTokenOwnershipOfBlueprint(tokenId: number) {
    await this.blueprintItemRepository.query(
      `
      UPDATE blueprint_item bi
      SET burned  = true,
          user_id = null
      FROM nft_metadata nm
      WHERE nm.id = bi.nft_metadata_id
        AND nm.token_id = $1;`,
      [tokenId],
    );
  }

  async updateBlueprintOwner(
    tokenId: number,
    walletAddress: string,
  ): Promise<void> {
    if (walletAddress === NULL_ADDRESS) {
      await this.nullifyBurnedTokenOwnershipOfBlueprint(tokenId);
    } else {
      await this.blueprintItemRepository.query(
        `
        UPDATE blueprint_item bi
        SET minted  = true,
            user_id = (select id from "user" where wallet_address = $1)
        FROM nft_metadata nm
        WHERE nm.id = bi.nft_metadata_id
          AND nm.token_id = $2;`,
        [walletAddress, tokenId],
      );
    }
  }

  // burn
  private async deleteUserBurnedMaterialToken(
    tokenId: number,
    materialItemId: number,
  ) {
    await this.userMaterialItemRepository.delete({
      materialItemId,
      tokenId,
    });
  }

  async upsertMaterialOnwer(
    tokenId: number,
    ownerWalletAddress: string, // 최종 토큰 보유 지갑
    materialContractAddress: string,
    from?: string,
  ) {
    let userExists = await this.userRepository.findOneBy({
      walletAddress:
        ownerWalletAddress === NULL_ADDRESS ? from : ownerWalletAddress,
    });
    const materialItemId = (
      await this.materialItemRepository.findOne({
        where: { contract: { address: materialContractAddress } },
      })
    ).id;

    if (userExists) {
      if (ownerWalletAddress === NULL_ADDRESS) {
        await this.deleteUserBurnedMaterialToken(tokenId, materialItemId);
      } else {
        await this.userMaterialItemRepository.upsert(
          {
            tokenId,
            materialItemId,
            userId: userExists.id,
          },
          {
            conflictPaths: {
              tokenId: true,
              materialItemId: true,
            },
          },
        );
      }
    }
  }
}
