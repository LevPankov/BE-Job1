import { Body, Controller, Delete, Get, ParseIntPipe, Patch, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, PartialType } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { CreateUserDto } from '../Dto/create-user.dto';
import { UserService } from '../user/user.service';

@UseGuards(AuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiResponse({
    status: 401,
    description: 'Unauthorized'
})
@Controller('profile')
export class ProfileController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get('get/my')
    @ApiResponse({
        status: 200,
        description: 'Returns user data'
    })
    getpPofile(@Request() req) {
        const login = req.user.login;
        return this.userService.getByLogin(login);
    }

    @Get('get/all')
    @ApiResponse({
        status: 200,
        description: 'Returns page with 3 user items'
    })
    @ApiResponse({
        status: 400,
        description: 'Page numbering starts from 1'
    })
    @ApiResponse({
        status: 400,
        description: 'Validation failed (numeric string is expected)'
    })
    getAll(@Query('page', ParseIntPipe) page: number) {
        return this.userService.getAll(page);
    }
    
    @Get('get')
    @ApiResponse({
        status: 200,
        description: 'User data without password_hash',
    })
    @ApiResponse({
        status: 404,
        description: 'User not found'
    })
    async findProfileByLogin(@Query('login') login: string) {
        const { password_hash, ...data } = await this.userService.getByLogin(login);
        return data;
    }

    @Patch('update')
    @ApiBody({ type: PartialType(CreateUserDto) })
    @ApiResponse({
        status: 200,
        description: 'Success!',
    })
    @ApiResponse({
        status: 400,
        description: 'Login is incorrect',
    })
    updateProfileByLogin(@Request() req, @Body() updateUserDto: Partial<CreateUserDto> ) {
        const login = req.user.login;
        return this.userService.updateByLogin(login, updateUserDto);
    }

    @Delete('delete')
    @ApiResponse({
        status: 200,
        description: 'Success!',
    })
    deleteProfileByLogin(@Request() req) {
        const login = req.user.login;
        return this.userService.removeByLogin(login);
    }
}
