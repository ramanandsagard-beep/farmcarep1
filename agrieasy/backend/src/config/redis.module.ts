import { Global, Module } from '@nestjs/common';
import Redis, { Redis as RedisClient } from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS',
      useFactory: async (): Promise<RedisClient> => {
        const url = process.env.REDIS_URL || 'redis://localhost:6379';
        const client = new Redis(url);
        return client;
      },
    },
  ],
  exports: ['REDIS'],
})
export class RedisModule {}
