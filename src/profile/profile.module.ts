import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [ProfileController],
})
export class ProfileModule {}
