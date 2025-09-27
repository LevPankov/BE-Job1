import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../Dto/create-user.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private readonly userService: UserService
    ) {}

    @Post('reg')
    @UsePipes(new ValidationPipe())
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
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.insert(createUserDto);
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
    signIn(@Body() signInDto: Record<string, string>) {
        return this.authService.signIn(signInDto.login, signInDto.password);
    }
}
