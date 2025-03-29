import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NftMetadataEntity } from '../entity/nft-metadata.entity';
import { OpenseaStandardMetadata } from 'src/module/metadata/dto/metadata.dto';
import { ContractEntity } from '../entity/contract.entity';
import { ContractKey, ContractType } from '../enum/contract.enum';

@Injectable()
export class NftRepositoryService {
  constructor(
    @InjectRepository(NftMetadataEntity)
    private nftMetadataRepository: Repository<NftMetadataEntity>,

    @InjectRepository(ContractEntity)
    private contractRepository: Repository<ContractEntity>,
  ) {}

  async findContractById(id: number): Promise<ContractEntity | null> {
    const contract = await this.contractRepository.findOneBy({ id });

    return contract;
  }

  async findContractByKey(key: ContractKey): Promise<ContractEntity | null> {
    const contract = await this.contractRepository.findOneBy({ key });

    return contract;
  }

  async findContractsByType(
    type: ContractType,
  ): Promise<ContractEntity[] | null> {
    const contracts = await this.contractRepository.findBy({ type });

    return contracts;
  }

  async findMetadataByTokenId(
    contractId: number,
    tokenId: number,
  ): Promise<OpenseaStandardMetadata> {
    const nftMetadata = await this.nftMetadataRepository.findOneBy({
      contractId,
      tokenId,
    });

    return nftMetadata?.metadata;
  }

  async findMetadataByContractId(
    contractId: number,
  ): Promise<OpenseaStandardMetadata> {
    const nftMetadata = await this.nftMetadataRepository.findOneBy({
      contractId,
    });

    return {
      ...nftMetadata?.metadata,
      name: `${nftMetadata?.metadata.name} #${nftMetadata?.tokenId}`,
    };
  }
}
