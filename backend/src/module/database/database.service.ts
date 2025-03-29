import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { ConfigService } from '../config/config.service';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const isLocal = this.configService.isLocal();

    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize:
        isLocal && this.configService.get<boolean>('DB_USE_SYNCHRONIZE'),
      namingStrategy: new SnakeNamingStrategy(),
      logging: isLocal ? true : ['error', 'warn'],
      useUTC: true,
      ssl: isLocal
        ? false
        : {
            ca: this.configService.get<string>('DB_SSL_CA'),
            rejectUnauthorized: true,
          },
    };
  }
}
