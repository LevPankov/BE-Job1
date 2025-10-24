import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UploadFilePayloadDto } from '../providers/files/s3/dto/upload-file-payload.dto';
import { IFileService } from '../providers/files/files.adapter';
import { RemoveFilePayloadDto } from '../providers/files/s3/dto/remove-file-payload.dto';
import { FileUploaderRepository } from './file-uploader.repository';
import { NewUserAvatar } from '../providers/database/types';
import { UserAvatarsResDto } from './dto/user-avatars-res.dto';

const maxAvatarsCount = 5;

@Injectable()
export class FileUploaderService {
  constructor(
    private fileUploaderRepository: FileUploaderRepository,
    private fileService: IFileService,
  ) {}

  async getUserAvatars(userId: string): Promise<UserAvatarsResDto[]> {
    return await this.fileUploaderRepository.getAllUserAvatars(userId);
  }

  async uploadAvatar(userId: string, file: Express.Multer.File): Promise<void> {
    const avatarsCount =
      await this.fileUploaderRepository.getCountOfUserAvatars(userId);
    console.log(avatarsCount);
    if (avatarsCount >= maxAvatarsCount) {
      throw new BadRequestException(
        `Too many avatars alredy exist. Max count equals ${maxAvatarsCount}`,
      );
    }

    let fileUploaded = false;
    let dbRecordCreated = false;

    try {
      const uploadFile: UploadFilePayloadDto = {
        file: file,
        folder: `/${userId}/avatars`,
        name: file.originalname,
      };
      await this.fileService.uploadFile(uploadFile);
      fileUploaded = true;

      const newUserAvatar: NewUserAvatar = {
        user_id: userId,
        avatar_path: file.originalname,
      };
      await this.fileUploaderRepository.create(newUserAvatar);
      dbRecordCreated = true;
    } catch (error) {
      if (fileUploaded && !dbRecordCreated) {
        const removeFile: RemoveFilePayloadDto = {
          path: `/${userId}/avatars/${file.originalname}`,
        };
        await this.fileService.removeFile(removeFile);
      }

      if (!fileUploaded && dbRecordCreated) {
        const avatar = await this.fileUploaderRepository.getAvatarByPath(
          file.originalname,
        );
        if (!avatar) {
          throw new Error('Something went wrong with uploadAvatar function');
        }
        await this.fileUploaderRepository.removeHardUserAvatar(
          userId,
          avatar.avatar_path,
        );
      }

      throw error;
    }
  }

  async removeAvatar(userId: string, avatarId: string): Promise<void> {
    await this.fileUploaderRepository.removeUserAvatar(userId, avatarId);
  }

  async removeHardAvatar(userId: string, avatarId: string): Promise<void> {
    const userAvatar =
      await this.fileUploaderRepository.getAvatarById(avatarId);
    if (!userAvatar) {
      throw new NotFoundException("Such avatar doesn't exist");
    }

    await this.fileUploaderRepository.removeHardUserAvatar(userId, avatarId);

    const removeFile: RemoveFilePayloadDto = {
      path: `/${userId}/avatars/${userAvatar.avatar_path}`,
    };
    await this.fileService.removeFile(removeFile);
  }
}
