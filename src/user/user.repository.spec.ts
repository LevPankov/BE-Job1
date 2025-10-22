import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { NotFoundException } from '@nestjs/common';
//import { Kysely } from 'kysely';
//import { Database } from '../providers/database/types';
import { PasswordService } from '../common/utils/password-hasher.util';

const mockKysely = {
  selectFrom: jest.fn(),
  insertInto: jest.fn(),
  updateTable: jest.fn(),
  deleteFrom: jest.fn(),
};

describe('UserRepository', () => {
  let userRepository: UserRepository;
  //let kysely: jest.Mocked<Kysely<Database>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        { provide: 'KYSELY_DB', useValue: mockKysely },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    //kysely = module.get('KYSELY_DB');

    jest.clearAllMocks();
  });

  it('UserRepository should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  it('should return user when it found', async () => {
    const hash_pass = PasswordService.hashPassword('qwerty');
    const mockUser = {
      id: 1,
      login: 'Oleg',
      password: hash_pass,
      email: 'oleg@mail.ru',
      age: 23,
      description: 'tralala',
    };

    const mockSelect = {
      selectAll: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      executeTakeFirst: jest.fn().mockResolvedValue(mockUser),
    };

    mockKysely.selectFrom.mockReturnValue(mockSelect as any);

    const result = await userRepository.getByLogin('Oleg');

    expect(mockKysely.selectFrom).toHaveBeenCalledWith('users');
    expect(mockSelect.where).toHaveBeenCalledWith('login', '=', 'Oleg');
    expect(result).toEqual(mockUser);
  });

  it('should throw exception when user not found', async () => {
    const mockSelect = {
      selectAll: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      executeTakeFirst: jest.fn().mockResolvedValue(undefined),
    };

    mockKysely.selectFrom.mockReturnValue(mockSelect as any);

    await expect(userRepository.getByLogin('Kolya')).rejects.toThrow(
      NotFoundException,
    );
    await expect(userRepository.getByLogin('Kolya')).rejects.toThrow(
      'User with login Kolya not found',
    );
  });
});
