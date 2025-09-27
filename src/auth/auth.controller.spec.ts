import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../Dto/create-user.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

const mockAuthService = {
  signIn: jest.fn(),
};

const mockUserService = {
  insert: jest.fn(),
  getByLogin: jest.fn(),
};

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create user', async () => {
      const createUserDto: CreateUserDto = {
        login: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        age: 25,
        description: 'Test user'
      };

      const expectedResult = {
        id: 1,
        login: 'testuser',
        email: 'test@example.com',
        age: 25,
        created_at: new Date()
      };

      mockUserService.insert.mockResolvedValue(expectedResult);

      const result = await authController.createUser(createUserDto);

      expect(userService.insert).toHaveBeenCalledWith(createUserDto);
      expect(userService.insert).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should fail from UserService', async () => {
      const createUserDto: CreateUserDto = {
        login: 'existinguser',
        email: 'existing@example.com',
        password: 'password123',
        age: 30,
        description: 'trala'
      };

      const error = new BadRequestException('Login already exists');
      
      mockUserService.insert.mockRejectedValue(error);

      await expect(authController.createUser(createUserDto))
        .rejects
        .toThrow(BadRequestException);
      
      await expect(authController.createUser(createUserDto))
        .rejects
        .toThrow('Login already exists');
    });
  });

  describe('signIn', () => {
    it('should return access_token in success login', async () => {
      const signInDto = {
        login: 'testuser',
        password: 'correctpassword'
      };

      const expectedToken = {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      };

      mockAuthService.signIn.mockResolvedValue(expectedToken);

      const result = await authController.signIn(signInDto);

      expect(authService.signIn).toHaveBeenCalledWith('testuser', 'correctpassword');
      expect(authService.signIn).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedToken);
    });

    it('should return UnauthorizedException in wrong data', async () => {
      const signInDto = {
        login: 'testuser',
        password: 'wrongpassword'
      };

      mockAuthService.signIn.mockRejectedValue(new UnauthorizedException());

      await expect(authController.signIn(signInDto))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });
});