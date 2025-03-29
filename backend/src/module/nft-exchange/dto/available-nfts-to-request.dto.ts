import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/dto/request.dto';

export class AvailableNftsToRequestRequest extends PaginationDto {
    @ApiProperty({ required: false})
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    name: string;
}
