import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { RefreshTokenService } from './refresh-token.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthRepository, AuthService, RefreshTokenService]
})
export class AuthModule { }
