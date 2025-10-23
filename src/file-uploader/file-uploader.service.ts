import { Injectable } from '@nestjs/common';
import { UploadFilePayloadDto } from '../providers/files/s3/dto/upload-file-payload.dto';
import { IFileService } from '../providers/files/files.adapter';
import { RemoveFilePayloadDto } from '../providers/files/s3/dto/remove-file-payload.dto';
import { RemoveAvatarNumberDto } from './dto/remove-avatar-number.dto';

@Injectable()
export class FileUploaderService {
  constructor(private fileService: IFileService) {}

  uploadFile(login: string, file: Express.Multer.File): void {
    const uploadFile: UploadFilePayloadDto = {
      file: file,
      folder: `/${login}/avatars`,
      name: file.originalname,
    };
    this.fileService.uploadFile(uploadFile);
  }

  removeFile(login: string, removeAvatarNumber: RemoveAvatarNumberDto): void {
    const removeFile: RemoveFilePayloadDto = {
      path: `/${login}/avatars/${removeAvatarNumber.avatarNumber}.*`,
    };
    this.fileService.removeFile(removeFile);
  }
}
