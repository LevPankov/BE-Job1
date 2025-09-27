import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { PasswordService } from '../user/password.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

const mockUserService = {
  getByLogin: jest.fn(),
};

const mockPasswordService = {
  validatePassword: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let passwordService: PasswordService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: PasswordService,
          useValue: mockPasswordService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    passwordService = module.get<PasswordService>(PasswordService);
    jwtService = module.get<JwtService>(JwtService);
    
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should return  JWT token with right data', async () => {
      const login = 'testuser';
      const password = 'correctpassword';
      
      const mockUser = {
        id: 1,
        login: 'testuser',
        password_hash: 'hashed_password_123',
        email: 'test@example.com',
        age: 25
      };

      const expectedToken = {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      };

      mockUserService.getByLogin.mockResolvedValue(mockUser);
      mockPasswordService.validatePassword.mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue(expectedToken.access_token);

      const result = await authService.signIn(login, password);

      expect(userService.getByLogin).toHaveBeenCalledWith('testuser');
      expect(userService.getByLogin).toHaveBeenCalledTimes(1);

      expect(passwordService.validatePassword).toHaveBeenCalledWith(
        'correctpassword',
        'hashed_password_123'
      );
      expect(passwordService.validatePassword).toHaveBeenCalledTimes(1);

      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: 1,
        login: 'testuser'
      });
      expect(jwtService.signAsync).toHaveBeenCalledTimes(1);

      expect(result).toEqual(expectedToken);
    });

    it('should throw UnauthorizedException in bad password', async () => {
      const login = 'testuser';
      const password = 'wrongpassword';
      
      const mockUser = {
        id: 1,
        login: 'testuser',
        password_hash: 'hashed_password_123'
      };

      mockUserService.getByLogin.mockResolvedValue(mockUser);
      mockPasswordService.validatePassword.mockResolvedValue(false);

      await expect(authService.signIn(login, password))
        .rejects
        .toThrow(UnauthorizedException);
      
      await expect(authService.signIn(login, password))
        .rejects
        .toThrow();

      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('должен корректно обрабатывать пользователя без дополнительных полей', async () => {
      const mockUser = {
        id: 2,
        login: 'simpleuser',
        password_hash: 'hash123'
      };

      mockUserService.getByLogin.mockResolvedValue(mockUser);
      mockPasswordService.validatePassword.mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('jwt_token');

      const result = await authService.signIn('simpleuser', 'password');

      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: 2,
        login: 'simpleuser'
      });
      expect(result.access_token).toBe('jwt_token');
    });

    it('should work with empty logiin and password', async () => {
      const mockUser = {
        id: 3,
        login: '',
        password_hash: 'hash123'
      };

      mockUserService.getByLogin.mockResolvedValue(mockUser);
      mockPasswordService.validatePassword.mockResolvedValue(false);

      await expect(authService.signIn('', ''))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });
});