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
import { FileUploaderService } from './file-uploader.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../common/decorators/user.decorator';
import { UserAvatarsResDto } from './dto/user-avatars-res.dto';

@Controller('file-uploader')
export class FileUploaderController {
  constructor(private fileUploaderService: FileUploaderService) {}

  @Get('get/avatars')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  getUserAvatars(@User('sub') userId: string): Promise<UserAvatarsResDto[]> {
    return this.fileUploaderService.getUserAvatars(userId);
  }

  @Post('upload')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  //@ApiBody({ type: CreateUserDto })
  //@ApiResponse({ status: 201, description: 'Success!' })
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
    return this.fileUploaderService.uploadAvatar(userId, file);
  }

  @Delete('remove')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  async removeAvatar(
    @User('sub') userId: string,
    @Query('avatarId') avatarId: string,
  ): Promise<void> {
    return this.fileUploaderService.removeAvatar(userId, avatarId);
  }

  @Delete('remove-hard')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  async removeHardAvatar(
    @User('sub') userId: string,
    @Query('avatarId') avatarId: string,
  ): Promise<void> {
    return this.fileUploaderService.removeHardAvatar(userId, avatarId);
  }
}
