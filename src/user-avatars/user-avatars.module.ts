import { Module } from '@nestjs/common';
import { UserAvatarsController } from './user-avatars.controller';
import { UserAvatarsService } from './user-avatars.service';
import { FilesModule } from 'src/providers/files/files.module';
import { UserAvatarsRepository } from './user-avatars.repository';

@Module({
  imports: [FilesModule],
  controllers: [UserAvatarsController],
  providers: [UserAvatarsService, UserAvatarsRepository],
})
export class UserAvatarsModule {}
