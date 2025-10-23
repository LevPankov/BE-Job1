import {
  Controller,
  Delete,
  FileTypeValidator,
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
import { RemoveAvatarNumberDto } from './dto/remove-avatar-number.dto';

@Controller('file-uploader')
export class FileUploaderController {
  constructor(private fileUploaderService: FileUploaderService) {}

  @Post('upload')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  //@ApiBody({ type: CreateUserDto })
  //@ApiResponse({ status: 201, description: 'Success!' })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @User('login') login: string,
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
  ): void {
    this.fileUploaderService.uploadFile(login, file);
  }

  @Delete('remove')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  removeFile(
    @User('login') login: string,
    @Query('avatarNumber') removeAvatarNumber: RemoveAvatarNumberDto,
  ): void {
    this.fileUploaderService.removeFile(login, removeAvatarNumber);
  }
}
