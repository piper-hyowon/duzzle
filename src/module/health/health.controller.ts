import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiExcludeController, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiExcludeController(true)
@Controller('health')
@ApiTags('health')
export class HealthController {
  constructor() {}

  @Get()
  @ApiOkResponse({ type: String, description: 'OK' })
  @HttpCode(HttpStatus.OK)
  check(): string {
    return 'OK';
  }
}
