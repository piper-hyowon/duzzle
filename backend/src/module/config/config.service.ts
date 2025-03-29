import { Injectable } from '@nestjs/common';
import { EnvironmentKey, SupportedEnvironment } from './Configuration';
import { ConfigService as _ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly configService: _ConfigService) {}

  get<T>(key: EnvironmentKey): T {
    return this.configService.get<T>(key);
  }

  isLocal(): boolean {
    return this.get<string>('ENV') === SupportedEnvironment.local;
  }
  isProduction(): boolean {
    return this.get<string>('ENV') === SupportedEnvironment.production;
  }
}
