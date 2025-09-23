import { Body, Controller, Delete, Get, Patch, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserDto } from 'src/Dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Controller('profile')
export class ProfileController {
    constructor(
        private readonly userService: UserService
    ) {}

    @UseGuards(AuthGuard)
    @Get('get')
    getpPofile(@Request() req) {
        const login = req.user.login;
        return this.userService.getByLogin(login);
    }

    @UseGuards(AuthGuard)
    @Patch('update')
    async updateProfileByLogin(@Request() req, @Body() updateUserDto: Partial<CreateUserDto> ) {
        const login = req.user.login;
        return this.userService.updateByLogin(login, updateUserDto);
        }

    @UseGuards(AuthGuard)
    @Delete('delete')
    async deleteProfileByLogin(@Request() req) {
        const login = req.user.login;
        return this.userService.removeByLogin(login);
    }
}
