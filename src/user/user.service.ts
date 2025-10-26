import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { PasswordService } from '../common/utils/password-hasher.util';
import { User, UserUpdate } from '../providers/database/types';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEnteredInfoResDto } from './dto/user-entered-info.res.dto.';
import { UserInfoResDto } from './dto/user-info.res.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAll(page: number): Promise<UserEnteredInfoResDto[] | User[]> {
    // Магические числа какие-то, не понимаю, что они делают. Добавь для них переменные
    if (page == -1) {
      return await this.userRepository.getAll();
    }

    if (page == -2) {
      return await this.userRepository.getAllWithDeleted();
    }

    if (page < 1) {
      throw new BadRequestException('Page numbering starts from 1');
    }

    // Нужно переписать в один метод. Вместо двух getAll и getAllPaginated должен получить один getAllPaginated
    // Вот здесь (https://plausible-cyclamen-6e0.notion.site/2792857f7b09801e8ce5f6bcd104dd73) есть гайд по пагинации на TypeORM. Его можно адаптировать под kysely
    return await this.userRepository.getAllPaginated(page);
  }

  async getByLogin(login: string): Promise<UserInfoResDto> {
    const user = await this.userRepository.getByLogin(login);

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
      userUpdate.password_hash = await PasswordService.hashPassword(
        data.password,
      );
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
