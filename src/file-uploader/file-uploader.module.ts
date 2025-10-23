import { Module } from '@nestjs/common';
import { FileUploaderController } from './file-uploader.controller';
import { FileUploaderService } from './file-uploader.service';
import { FilesModule } from 'src/providers/files/files.module';

@Module({
  imports: [FilesModule],
  controllers: [FileUploaderController],
  providers: [FileUploaderService],
})
export class FileUploaderModule {}
