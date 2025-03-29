import { Injectable } from '@nestjs/common';
import {
  GetMetadataRequest,
  OpenseaStandardMetadata,
} from './dto/metadata.dto';
import { NftRepositoryService } from './../repository/service/nft.repository.service';

@Injectable()
export class MetadataService {
  constructor(private readonly nftRepositoryService: NftRepositoryService) {}

  async getMetadata(
    dto: GetMetadataRequest,
  ): Promise<OpenseaStandardMetadata | null> {
    const { contractId, tokenId } = dto;
    const contract =
      await this.nftRepositoryService.findContractById(contractId);

    const metadata: OpenseaStandardMetadata = contract.isTokenIdAutoIncremented
      ? await this.nftRepositoryService.findMetadataByContractId(contractId)
      : await this.nftRepositoryService.findMetadataByTokenId(
          contractId,
          tokenId,
        );

    return metadata;
  }
}
