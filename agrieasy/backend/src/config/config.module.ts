import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from './redis.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'devsecret',
      signOptions: { expiresIn: '7d' },
    }),
    RedisModule,
  ],
  exports: [JwtModule, RedisModule],
})
export class ConfigModule {}
