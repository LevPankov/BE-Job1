import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

describe('ProfileController', () => {
  let controller: ProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule, AuthModule],
      controllers: [ProfileController]
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
  });

  it('ProfileController should be defined', () => {
    expect(controller).toBeDefined();
  });
});
