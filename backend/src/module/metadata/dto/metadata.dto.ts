import { IsDefined, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class MetadataAttribute {
  display_type?: string;
  trait_type: string;
  value: number | string;
}

export class OpenseaStandardMetadata {
  name?: string;
  image?: string;
  description?: string;
  attributes: Array<MetadataAttribute>;
}

export class GetMetadataRequest {
  @IsNumber()
  @Type(() => Number)
  public contractId: number;

  @IsNumber()
  @Type(() => Number)
  public tokenId: number;
}
