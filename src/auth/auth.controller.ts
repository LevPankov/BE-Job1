import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/Dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private readonly userService: UserService
    ) {}

    @UsePipes(new ValidationPipe())
    @Post('reg')
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.insert(createUserDto);
    }

    @Post('login')
    signIn(@Body() signInDto: Record<string, any>) {
        return this.authService.signIn(signInDto.login, signInDto.password);
    }
}
