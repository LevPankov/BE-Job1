import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { DatabaseModule } from './providers/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { FileUploaderModule } from './file-uploader/file-uploader.module';
import { FilesModule } from './providers/files/files.module';

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
    DatabaseModule,
    FilesModule,
    UserModule,
    AuthModule,
    FileUploaderModule,
  ],
})
export class AppModule {}
