import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { DatabaseModule } from '../database/database.module';
import { PasswordService } from './password.service';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [DatabaseModule, ConfigModule, JwtModule],
  controllers: [UserController],
  providers: [UserRepository, PasswordService, UserService],
  exports: [UserRepository, PasswordService, UserService]
})
export class UserModule {}
