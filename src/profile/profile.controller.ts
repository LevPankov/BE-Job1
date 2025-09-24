import { Body, Controller, Delete, Get, ParseIntPipe, Patch, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserDto } from 'src/Dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@UseGuards(AuthGuard)
@Controller('profile')
export class ProfileController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get('get/my')
    getpPofile(@Request() req) {
        const login = req.user.login;
        return this.userService.getByLogin(login);
    }

    @Get('get/all')
    getAll(@Query('page', ParseIntPipe) page: number) {
        return this.userService.getAll(page);
    }
    
    @Get('get')
    async findProfileByLogin(@Query('login') login: string) {
        const { password_hash, ...data } = await this.userService.getByLogin(login);
        return data;
    }

    @Patch('update')
    updateProfileByLogin(@Request() req, @Body() updateUserDto: Partial<CreateUserDto> ) {
        const login = req.user.login;
        return this.userService.updateByLogin(login, updateUserDto);
    }

    @Delete('delete')
    deleteProfileByLogin(@Request() req) {
        const login = req.user.login;
        return this.userService.removeByLogin(login);
    }
}
