import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get<T>(key) {
    return await this.cache.get<T>(key);
  }

  async set<T>(key, value) {
    await this.cache.set<T>(key, value);
  }
}
