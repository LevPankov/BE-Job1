import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUserDto } from './dto/auth-user.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private readonly userService: UserService
    ) {}

    @Post('reg')
    @ApiBody( { type: CreateUserDto })
    @ApiResponse({
        status: 201,
        description: 'Success!',
    })
    @ApiResponse({
        status: 400,
        description: 'Incorrect data',
    })
    @ApiResponse({
        status: 400,
        description: 'Login is already exist',
    })
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Post('login')
    @ApiBody( { 
        schema: { 
            type: 'object',
            properties: {
                login: { type: 'string', example: 'login' },
                password: { type: 'string', example: 'qwerty' }
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'return access_token',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: 404,
        description: 'User not found',
    })
    signIn(@Body() signInDto: AuthUserDto) {
        return this.authService.signIn(signInDto.login, signInDto.password);
    }
}
