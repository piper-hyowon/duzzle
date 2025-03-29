import { Controller, Get, Param } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import {
  GetMetadataRequest,
  OpenseaStandardMetadata,
} from './dto/metadata.dto';
import { MetadataService } from './metadata.service';

@Controller('metadata')
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}

  @ApiExcludeEndpoint()
  @Get(':contractId/:tokenId')
  async getMetadata(
    @Param() dto: GetMetadataRequest,
  ): Promise<OpenseaStandardMetadata | null> {
    const result = await this.metadataService.getMetadata(dto);
    return result;
  }
}
