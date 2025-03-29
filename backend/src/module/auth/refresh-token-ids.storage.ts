import { Injectable } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { InvalidatedRefreshTokenError } from 'src/types/error/application-exceptions/401-unautorized';

@Injectable()
export class RefreshTokenIdsStorage {
  private readonly prefix: string = 'refersh:user';

  constructor(private readonly memory: CacheService) {}

  async insert(userId: number, tokenId: string): Promise<void> {
    await this.memory.set(this.getKey(userId), tokenId);
  }

  async validate(userId: number, tokenId: string): Promise<boolean> {
    const storedId = await this.memory.find(this.getKey(userId));
    if (storedId !== tokenId) {
      throw new InvalidatedRefreshTokenError();
    }
    return storedId === tokenId;
  }

  async invalidate(userId: number): Promise<void> {
    await this.memory.remove(this.getKey(userId));
  }

  private getKey(userId: number): string {
    return `${this.prefix}:${userId}`;
  }
}
