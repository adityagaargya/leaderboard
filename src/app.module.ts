import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ContestsModule } from './contests/contests.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ParticipationsModule } from './participations/participations.module';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
        CacheModule.registerAsync({
      useFactory: async () => ({
        store: redisStore,
        host: 'localhost',
        port: 6379,
        ttl: 60, // default TTL in seconds
      }),
      isGlobal: true,
    }),
    AuthModule, UsersModule, DatabaseModule, ContestsModule, ParticipationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
