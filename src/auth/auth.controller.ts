import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/Dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private readonly userService: UserService
    ) {}

    @Post('reg')
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.insert(createUserDto);
    }

    @Post('login')
    signIn(@Body() signInDto: Record<string, any>) {
        return this.authService.signIn(signInDto.login, signInDto.password);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getpPofile(@Request() req) {
        const login = req.user.login;
        return this.userService.getByLogin(login);
    }
}
