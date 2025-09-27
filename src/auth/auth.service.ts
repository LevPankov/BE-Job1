import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from '../user/password.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private passwordService: PasswordService,
        private jwtService: JwtService
    ) {}

    async signIn(login: string, pass: string) {
        const user = await this.userService.getByLogin(login);
        if (!await this.passwordService.validatePassword(pass, user.password_hash)) {
            throw new UnauthorizedException();
        }

        const payload = { sub: user.id, login: user.login };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
