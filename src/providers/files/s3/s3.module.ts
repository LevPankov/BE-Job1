import * as AWS from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';

import { S3Lib } from './constants/do-spaces-service-lib.constant';
import { S3Service } from './s3.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    S3Service,
    {
      provide: S3Lib,
      useFactory: (configService: ConfigService) => {
        return new AWS.S3({
          endpoint: configService.get<string>('minio.endpoint'),
          region: configService.get<string>('minio.region'),
          credentials: {
            accessKeyId: configService.getOrThrow<string>('minio.accessKeyId'),
            secretAccessKey: configService.getOrThrow<string>(
              'minio.secretAccessKey',
            ),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [S3Service, S3Lib],
})
export class S3Module {}
