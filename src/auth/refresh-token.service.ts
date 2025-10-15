import { Injectable } from '@nestjs/common';
import { NewRefreshToken, RefreshToken } from '../database/types';
import * as crypto from 'crypto';
import { AuthRepository } from './auth.repository';

@Injectable()
export class RefreshTokenService {
    constructor(
            private authRepository: AuthRepository
        ) {}

    generateToken(): string {
        return crypto.randomBytes(40).toString('hex');
    }

    hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    async createToken(userId: number, expiresInDays: number = 7): Promise<string> {
        const token = this.generateToken();
        const tokenHash = this.hashToken(token);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expiresInDays);

        const newRefreshToken: NewRefreshToken = {
            user_id: userId,
            token: tokenHash,
            expires_at: expiresAt,
            revoked: false
        }
        await this.authRepository.createToken(newRefreshToken);

        return token;
    }

    async findValidToken(token: string): Promise<RefreshToken | null> {
        const tokenHash = this.hashToken(token);
        const result = await this.authRepository.getValidToken(tokenHash);
        return result || null;
    }

    revokeToken(token: string): void {
        const tokenHash = this.hashToken(token); 
        this.authRepository.revokeToken(tokenHash);
    }

    revokeAllUserTokens(userId: number): void {
        this.authRepository.revokeAllUserTokens(userId);
    }

    cleanupExpiredTokens(): void {
        this.authRepository.deleteExpiredTokens();
    }
}