import { Body, Controller, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUserDto } from './dto/auth-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto ';
import { AuthGuard } from './auth.guard';
import { User } from '../common/decorators/user.decorator';
import { RefreshTokenResDto } from './dto/refresh-token.res.dto';

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
    createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
        return this.authService.createProfile(createUserDto);
    }

    @Post('login')
    @ApiBody({ type: AuthUserDto })
    @ApiResponse({ status: 201, description: 'Return access and refresh tokens' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'User not found' })
    signIn(@Body() signInDto: AuthUserDto): Promise<RefreshTokenResDto> {
        return this.authService.signIn(signInDto.login, signInDto.password);
    }

    @Post('refresh')
    @ApiBody({ type: RefreshTokenDto })
    @ApiResponse({ status: 201, description: 'Refresh access token using refresh token' })
    @ApiResponse({ status: 401, description: 'Invalid refresh token' })
    refresh(@Body() refreshDto: RefreshTokenDto): Promise<RefreshTokenResDto> {
        return this.authService.refreshTokens(refreshDto.refresh_token);
    }

    @Post('logout')
    @UseGuards(AuthGuard)
    @ApiBody({ type: RefreshTokenDto })
    @ApiResponse({ status: 201, description: 'Successfully logged out' })
    logout(@Body() refreshDto: RefreshTokenDto): void {
        return this.authService.logout(refreshDto.refresh_token);
    }

    @Post('logout-all')
    @UseGuards(AuthGuard)
    @ApiBody({ type: RefreshTokenDto })
    @ApiResponse({ status: 201, description: 'Successfully logged out from all devices' })
    logoutAll(@User('sub', ParseIntPipe) id: number): void {
        console.log(id);
        return this.authService.logoutAll(id);
    }
}
