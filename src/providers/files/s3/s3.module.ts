import * as AWS from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';

import { S3Lib } from './constants/do-spaces-service-lib.constant';
import { S3Service } from './s3.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    S3Service,
    {
      provide: S3Lib,
      useFactory: (configService: ConfigService) => {
        return new AWS.S3({
          endpoint: configService.getOrThrow<string>('minio.endpoint'),
          region: configService.getOrThrow<string>('minio.region'),
          credentials: {
            accessKeyId: configService.getOrThrow<string>('minio.accessKeyId'),
            secretAccessKey: configService.getOrThrow<string>(
              'minio.secretAccessKey',
            ),
          },
        });
      },
    },
  ],
  exports: [S3Service, S3Lib],
})
export class S3Module {}
