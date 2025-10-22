import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { UserService } from '../user/user.service';
import { User } from '../common/decorators/user.decorator';
import { UserLoginDto } from './dto/user-login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEnteredInfoResDto } from './dto/user-entered-info.res.dto.';
import { UserInfoResDto } from './dto/user-info.res.dto';

@UseGuards(AuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiResponse({ status: 401, description: 'Unauthorized' })
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get/my')
  @ApiResponse({ status: 200, description: 'Returns user data' })
  getpPofile(@User('login') login: string): Promise<UserInfoResDto> {
    return this.userService.getByLogin(login);
  }

  @Get('get/all')
  @ApiResponse({ status: 200, description: 'Returns page with 3 user items' })
  @ApiResponse({ status: 400, description: 'Page numbering starts from 1' })
  @ApiResponse({
    status: 400,
    description: 'Validation failed (numeric string is expected)',
  })
  getAll(
    @Query('page', ParseIntPipe) page: number,
  ): Promise<UserEnteredInfoResDto[]> {
    return this.userService.getAll(page);
  }

  @Get('get')
  @ApiQuery({ name: 'login' })
  @ApiResponse({ status: 200, description: 'User data without password_hash' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findProfileByLogin(
    @Query() userLoginDto: UserLoginDto,
  ): Promise<UserEnteredInfoResDto> {
    const { password_hash: _, ...data } = await this.userService.getByLogin(
      userLoginDto.login,
    );
    return data;
  }

  @Patch('update')
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Success!' })
  @ApiResponse({ status: 400, description: 'Login is incorrect' })
  updateProfileByLogin(
    @User('login') login: string,
    @Body() updateUserDto: UpdateUserDto,
  ): void {
    this.userService.updateByLogin(login, updateUserDto);
  }

  @Delete('delete')
  @ApiResponse({ status: 200, description: 'Success!' })
  deleteProfileByLogin(@User('login') login: string): void {
    this.userService.removeByLogin(login);
  }

  @Delete('hard-delete')
  @ApiResponse({ status: 200, description: 'Success!' })
  hardDeleteProfileByLogin(@User('login') login: string): void {
    this.userService.removeHardByLogin(login);
  }
}
