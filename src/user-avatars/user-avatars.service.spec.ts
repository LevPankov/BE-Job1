import { Test, TestingModule } from '@nestjs/testing';
import { UserAvatarsService } from './user-avatars.service';

describe('FileUploaderService', () => {
  let service: UserAvatarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAvatarsService],
    }).compile();

    service = module.get<UserAvatarsService>(UserAvatarsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
