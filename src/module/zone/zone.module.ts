import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/module/repository/repository.module';
import { ZoneService } from './zone.service';

@Module({
  imports: [RepositoryModule],
  providers: [ZoneService],
  exports: [ZoneService],
})
export class ZoneModule {}
