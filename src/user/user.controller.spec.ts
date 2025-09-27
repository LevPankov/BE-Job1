import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from '../Dto/create-user.dto';

const mockUserService = {
  insert: jest.fn(),
  getAll: jest.fn(),
  getByLogin: jest.fn(),
  updateByLogin: jest.fn(),
  removeByLogin: jest.fn(),
};

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
      ]
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        login: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        age: 25,
        description: "something"
      };

      mockUserService.insert.mockResolvedValue("Success!");

      const result = await controller.createUser(createUserDto);

      expect(userService.insert).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual('Success!');
    });
});
