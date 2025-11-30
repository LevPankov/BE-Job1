import { Test, TestingModule } from '@nestjs/testing';
import { UserAvatarsController } from './user-avatars.controller';

describe('FileUploaderController', () => {
  let controller: UserAvatarsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAvatarsController],
    }).compile();

    controller = module.get<UserAvatarsController>(UserAvatarsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
