import { Module } from '@nestjs/common';
import { FileUploaderController } from './file-uploader.controller';
import { FileUploaderService } from './file-uploader.service';
import { FilesModule } from 'src/providers/files/files.module';
import { FileUploaderRepository } from './file-uploader.repository';

@Module({
  imports: [FilesModule],
  controllers: [FileUploaderController],
  providers: [FileUploaderService, FileUploaderRepository],
})
export class FileUploaderModule {}
