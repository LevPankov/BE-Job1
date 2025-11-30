import {
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserAvatarsService } from './user-avatars.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../common/decorators/user.decorator';
import { UserAvatarsResDto } from './dto/user-avatars-res.dto';
import { UserWithLatestAvatar } from 'src/providers/database/types';

@Controller('file-uploader')
export class UserAvatarsController {
  constructor(private userAvatarsService: UserAvatarsService) {}

  @Get('most-active')
  async getMostActiveUsers(): Promise<UserWithLatestAvatar[]> {
    return await this.userAvatarsService.getMostActiveUsers();
  }

  @Get('get/avatars')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  async getUserAvatars(@User('sub') userId: string): Promise<UserAvatarsResDto[]> {
    return await this.userAvatarsService.getUserAvatars(userId);
  }

  @Post('upload')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @User('sub') userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 1024 * 10 }),
          new FileTypeValidator({
            fileType: /(image\/png|image\/jpeg|image\/jpg)/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<void> {
    return this.userAvatarsService.uploadAvatar(userId, file);
  }

  @Delete('remove')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  async removeAvatar(@User('sub') userId: string, @Query('avatarId') avatarId: string): Promise<void> {
    return this.userAvatarsService.removeAvatar(userId, avatarId);
  }

  @Delete('remove-hard')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  async removeHardAvatar(@User('sub') userId: string, @Query('avatarId') avatarId: string): Promise<void> {
    return this.userAvatarsService.removeHardAvatar(userId, avatarId);
  }
}
