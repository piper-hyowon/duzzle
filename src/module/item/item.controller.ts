import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { ResponsesDataDto } from 'src/dto/responses-data.dto';
import { ItemService } from './item.service';
import { AuthGuard } from '../auth/auth.guard';
import { MyItemsResponse } from './dto/item.dto';
import { AuthenticatedUser } from '../auth/decorators/authenticated-user.decorator';
import { UserEntity } from '../repository/entity/user.entity';
import { ApiDescription } from 'src/decorator/api-description.decorator';
import { AuthorizationToken } from './../../constant/authorization-token';

@Controller()
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @UseGuards(AuthGuard)
  @ApiDescription({
    tags: 'Item',
    auth: {
      type: AuthorizationToken.BearerUserToken,
      required: true,
    },
    summary: '유저 보유 아이템 NFT 현황(현재 시즌만 해당)',
    listResponse: {
      status: HttpStatus.OK,
      schema: MyItemsResponse,
    },
  })
  @HttpCode(HttpStatus.OK)
  @Get('my/nft-items')
  async getPuzzleData(
    @AuthenticatedUser() user: UserEntity,
  ): Promise<ResponsesDataDto<MyItemsResponse>> {
    const result = await this.itemService.getUserItems(user.id);

    return new ResponsesDataDto(result);
  }
}
