import { Controller, Get, Query, Post, Body, Put, Param, Delete, Patch } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './Dto/create-user.dto';
import { User } from './Interfaces/user.interface'

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('reg')
  async createUser(@Body() createUserDto: CreateUserDto) {
    this.appService.create(createUserDto);
  }

  @Post('auth')
  async authentificate() {

  }

  @Get('getAll')
  async getAll(): Promise<User[]> {
    return this.appService.getAll();
  }

  @Get('getMy')
  async getMyProfile() {
    return "My profile";
  }

  @Patch('updProfile')
  async updateProfile() {

  }

  @Delete('deleteProfile')
  async deleteProfile() {

  }
}
