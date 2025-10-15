import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUserDto } from './dto/auth-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto ';
import { AuthGuard } from './auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) {}

    @Post('reg')
    @ApiBody( { type: CreateUserDto })
    @ApiResponse({ status: 201, description: 'Success!' })
    @ApiResponse({ status: 400, description: 'Incorrect data' })
    @ApiResponse({ status: 400, description: 'Login is already exist' })
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.authService.createProfile(createUserDto);
    }

    @Post('login')
    @ApiBody({ type: AuthUserDto })
    @ApiResponse({ status: 201, description: 'Return access and refresh tokens' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'User not found' })
    signIn(@Body() signInDto: AuthUserDto) {
        return this.authService.signIn(signInDto.login, signInDto.password);
    }

    @Post('refresh')
    @ApiBody({ type: RefreshTokenDto })
    @ApiResponse({ status: 201, description: 'Refresh access token using refresh token' })
    @ApiResponse({ status: 401, description: 'Invalid refresh token' })
    refresh(@Body() refreshDto: RefreshTokenDto) {
        return this.authService.refreshTokens(refreshDto.refresh_token);
    }

    @Post('logout')
    @UseGuards(AuthGuard)
    @ApiBody({ type: RefreshTokenDto })
    @ApiResponse({ status: 201, description: 'Successfully logged out' })
    async logout(@Body() refreshDto: RefreshTokenDto) {
        return this.authService.logout(refreshDto.refresh_token);
    }

    @Post('logout-all')
    @UseGuards(AuthGuard)
    @ApiBody({ type: RefreshTokenDto })
    @ApiResponse({ status: 201, description: 'Successfully logged out from all devices' })
    async logoutAll(@Request() req) {
        const id = req.user.sub;
        return this.authService.logoutAll(id);
    }
}
