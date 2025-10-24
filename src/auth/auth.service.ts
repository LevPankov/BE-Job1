import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from '../common/utils/password-hasher.util';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { NewUser } from '../providers/database/types';
import { AuthRepository } from './auth.repository';
import { RefreshTokenService } from './refresh-token.service';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenResDto } from './dto/refresh-token.res.dto';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  async createProfile(data: CreateUserDto): Promise<void> {
    const user = await this.authRepository.getByLoginWithDeleted(data.login);
    if (user) {
      throw new BadRequestException(`Login ${data.login} is already exists`);
    }

    const hashPassword = await PasswordService.hashPassword(data.password);
    const newUser: NewUser = {
      login: data.login,
      email: data.email,
      password_hash: hashPassword,
      age: data.age,
      description: data.description,
    };

    await this.authRepository.create(newUser);
  }

  async signIn(login: string, pass: string): Promise<RefreshTokenResDto> {
    const user = await this.authRepository.getByLogin(login);
    if (!user) {
      throw new NotFoundException(`User with login ${login} not found`);
    }
    if (!(await PasswordService.validatePassword(pass, user.password_hash))) {
      throw new UnauthorizedException();
    }

    const accessToken = await this.generateAccessToken(user.id, user.login);
    const refreshToken = await this.refreshTokenService.createToken(user.id);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'bearer',
      expires_in: this.configService.getOrThrow('jwt.accessExpiresIn'),
    };
  }

  async refreshTokens(refreshToken: string): Promise<RefreshTokenResDto> {
    const tokenEntity =
      await this.refreshTokenService.findValidToken(refreshToken);
    if (!tokenEntity) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.authRepository.getById(tokenEntity.user_id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    this.refreshTokenService.revokeToken(refreshToken);

    const newAccessToken = await this.generateAccessToken(user.id, user.login);
    const newRefreshToken = await this.refreshTokenService.createToken(user.id);

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
      token_type: 'bearer',
      expires_in: this.configService.getOrThrow('jwt.accessExpiresIn'),
    };
  }

  logout(refreshToken: string): void {
    this.refreshTokenService.revokeToken(refreshToken);
  }

  logoutAll(userId: string): void {
    this.refreshTokenService.revokeAllUserTokens(userId);
  }

  private generateAccessToken(userId: string, login: string): Promise<string> {
    const payload = { sub: userId, login: login };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('jwt.accessSecret'),
      expiresIn: this.configService.get('jwt.accessExpiresIn'),
    });
  }
}
