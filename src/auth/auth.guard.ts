import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../common/interfaces/jwt-payload-type'

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtSecvice: JwtService,
        private configService: ConfigService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        // if (await this.jwtBlacklistService.isTokenBlacklisted(token)) {
        //     throw new UnauthorizedException('Token has been revoked');
        // }
        try {
            const payload: JwtPayload = await this.jwtSecvice.verifyAsync(
                token,
                {
                    secret: this.configService.get<string>('jwt.accessSecret')
                }
            );
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}