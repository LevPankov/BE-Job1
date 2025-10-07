import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { DatabaseModule } from '../DB/database.module';
import { PasswordService } from './password.service';
import { UserService } from './user.service';


@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserRepository, PasswordService, UserService],
  exports: [UserRepository, PasswordService, UserService]
})
export class UserModule {}
