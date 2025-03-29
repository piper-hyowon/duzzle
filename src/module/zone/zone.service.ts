import { Inject } from '@nestjs/common';
import { ZoneRepositoryService } from '../repository/service/zone.repository.service';

export class ZoneService {
  constructor(
    @Inject(ZoneRepositoryService)
    private readonly zoneRepositoryService: ZoneRepositoryService,
  ) {}

  async setZones(): Promise<void> {
    await this.zoneRepositoryService.setZones();
  }
}
