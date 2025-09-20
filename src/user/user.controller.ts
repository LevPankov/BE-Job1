import { Controller, Get, Post, Body, Param, Delete, Patch, ParseIntPipe, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../Dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('reg')
  async createUser(@Body() createUserDto: CreateUserDto) {
    this.userService.insert(createUserDto);
  }

  @Post('auth')
  async authentificate(@Body('login') login : string, @Body('password') password : string) {
    return this.userService.isInDb(login, password);
  }

  @Get('get/all')
  async getAll() {
    return this.userService.getAll();
  }

  @Get('get/my')
  async getMyProfile() {
    return "My profile";
  }

  @Get('get/:id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getById(id);
  }

  @Patch('update/:id')
  async updateProfileById(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: Partial<CreateUserDto> ) {
    return this.userService.updateById(id, updateUserDto);
  }

  @Patch('update')
  async updateProfileByLogin(@Body('login') login: string, @Body() updateUserDto: Partial<CreateUserDto> ) {
    return this.userService.updateByLogin(login, updateUserDto);
  }

  @Delete('delete/:id')
  async deleteProfileById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.removeById(id);
  }

  @Delete('delete')
  async deleteProfileByLogin(@Body('login') login: string) {
    return this.userService.removeByLogin(login);
  }
}
