import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { DatabaseModule } from './providers/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { FileUploaderModule } from './file-uploader/file-uploader.module';
import { FilesModule } from './providers/files/files.module';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { BalanceOperationsModule } from './balance-operations/balance-operations.module';
import { CronJobsModule } from './cron-jobs/cron-jobs.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.accessSecret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.accessExpiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
          password: configService.get('redis.password'),
        },
      }),
    }),
    RedisCacheModule,
    DatabaseModule,
    FilesModule,
    UserModule,
    AuthModule,
    FileUploaderModule,
    BalanceOperationsModule,
    CronJobsModule,
  ],
})
export class AppModule {}
