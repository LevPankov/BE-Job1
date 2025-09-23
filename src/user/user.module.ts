import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/DB/database.module';
import { PasswordService } from './password.service';


@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService, PasswordService],
  exports: [UserService, PasswordService]
})
export class UserModule {}
