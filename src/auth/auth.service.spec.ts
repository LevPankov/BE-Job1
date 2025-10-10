import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { PasswordService } from '../utils/password-hasher.util';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

const mockUserService = {
  getByLogin: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
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
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should return  JWT token with right data', async () => {
      const login = 'testuser';
      const password = 'correctpassword';
      const password_hash = PasswordService.hashPassword(password);

      const mockUser = {
        id: 1,
        login: 'testuser',
        password_hash: password_hash,
        email: 'test@example.com',
        age: 25
      };

      const expectedToken = {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      };

      mockUserService.getByLogin.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue(expectedToken.access_token);

      const result = await authService.signIn(login, password);

      expect(userService.getByLogin).toHaveBeenCalledWith('testuser');
      expect(userService.getByLogin).toHaveBeenCalledTimes(1);

      expect(PasswordService.validatePassword).toHaveBeenCalledWith(
        password,
        password_hash
      );
      expect(PasswordService.validatePassword).toHaveBeenCalledTimes(1);

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
        password_hash: 'wrong_hash'
      };

      mockUserService.getByLogin.mockResolvedValue(mockUser);

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
    it('should correctly process the user without additional fields', async () => {
      const mockUser = {
        id: 2,
        login: 'simpleuser',
        password_hash: 'hash123'
      };

      mockUserService.getByLogin.mockResolvedValue(mockUser);
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

      await expect(authService.signIn('', ''))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });
});