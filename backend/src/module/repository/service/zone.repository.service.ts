import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ZoneEntity } from '../entity/zone.entity';
import { ZONES } from 'src/constant/zones';
import { SeasonZoneEntity } from '../entity/season-zone.entity';

@Injectable()
export class ZoneRepositoryService {
  constructor(
    @InjectRepository(ZoneEntity)
    private zoneRepository: Repository<ZoneEntity>,

    @InjectRepository(SeasonZoneEntity)
    private seasonZoneRepository: Repository<SeasonZoneEntity>,
  ) {}

  async getZones(): Promise<ZoneEntity[]> {
    const zones = await this.zoneRepository.find();

    return zones;
  }

  async getSeasonZones(): Promise<SeasonZoneEntity[]> {
    const seasonZones = await this.seasonZoneRepository.find();

    return seasonZones;
  }

  // 정의된 zone 목록을 DB 에 새롭게 세팅
  async setZones() {
    await this.zoneRepository.delete({});
    await this.zoneRepository.insert(ZONES);
  }
}
