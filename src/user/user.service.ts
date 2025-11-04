import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User, UserUpdate } from '../providers/database/types';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEnteredInfoResDto } from './dto/user-entered-info.res.dto.';
import { UserInfoResDto } from './dto/user-info.res.dto';
import { hashPassword } from '../common/utils/password-hasher.util';
import { RedisCacheService } from '../redis-cache/redis-cache.service';

const ALL_USERS_WITH_DELETED_DEBUG_NUMBER = -2;
const CACHE_KEY_FOR_ALL_USERS = 'users=';
const CACHE_KEY_FOR_ALL_USERS_WITH_DELETED_DEBUG = 'users=-2';
const CACHE_KEY_FOR_USER = 'user=';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly redisCache: RedisCacheService,
  ) {}

  async getAll(page: number): Promise<UserEnteredInfoResDto[] | User[]> {
    if (page == ALL_USERS_WITH_DELETED_DEBUG_NUMBER) {
      const cachedUsersWithDeletedDebug = await this.redisCache.get<User[]>(CACHE_KEY_FOR_ALL_USERS_WITH_DELETED_DEBUG);
      if (cachedUsersWithDeletedDebug) {
        return cachedUsersWithDeletedDebug;
      }
      const usersWithDeletedDebug = await this.userRepository.getAllWithDeleted();
      this.redisCache.set(CACHE_KEY_FOR_ALL_USERS_WITH_DELETED_DEBUG, usersWithDeletedDebug);
      return usersWithDeletedDebug;
    }

    if (page < 1) {
      throw new BadRequestException('Page numbering starts from 1');
    }
    const cachedUsers = await this.redisCache.get<UserEnteredInfoResDto[]>(CACHE_KEY_FOR_ALL_USERS + page);
    if (cachedUsers) {
      return cachedUsers;
    }
    const users = await this.userRepository.getAllPaginated(page);
    this.redisCache.set(CACHE_KEY_FOR_ALL_USERS + page, users);
    return users;
  }

  async getByLogin(login: string): Promise<UserInfoResDto> {
    const cachedUser = await this.redisCache.get<UserInfoResDto>(CACHE_KEY_FOR_USER + login);
    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.userRepository.getByLogin(login);
    this.redisCache.set(CACHE_KEY_FOR_USER + login, user);

    if (!user) {
      throw new NotFoundException(`User with login ${login} not found`);
    }

    return user;
  }

  // Ты ведь знаешь с помощью гуарда что у тебя пользователь залогинен и его данные у тебя уже есть
  // У нас пользователь может редактировать только самого себя
  // Если пользователь удалён, то он не может уже с собой ничего делать
  // Нужно видимо эту проверку добавить в гуард
  async updateByLogin(login: string, data: UpdateUserDto): Promise<void> {
    const user = await this.userRepository.getByLoginWithDeleted(login);
    if (!user) {
      throw new BadRequestException('Login is incorrect');
    }
    if (user.deleted_at != null) {
      throw new BadRequestException(`You can't update deleted profiles`);
    }

    const userUpdate: UserUpdate = {
      email: data.email,
      age: data.age,
      description: data.description,
    };
    if (data.password) {
      userUpdate.password_hash = await hashPassword(data.password);
    }

    return this.userRepository.updateByLogin(login, userUpdate);
  }

  removeByLogin(login: string): void {
    this.userRepository.removeByLogin(login);
  }

  removeHardByLogin(login: string): void {
    this.userRepository.removeHardByLogin(login);
  }
}
