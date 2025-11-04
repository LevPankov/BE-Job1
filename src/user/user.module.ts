import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';

@Module({
  imports: [RedisCacheModule],
  controllers: [UserController],
  providers: [UserRepository, UserService],
})
export class UserModule {}
