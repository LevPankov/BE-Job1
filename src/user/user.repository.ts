import { Inject, Injectable } from '@nestjs/common';
import { Database, User, UserUpdate } from '../providers/database/types';
import { Kysely } from 'kysely';
import { UserInfoResDto } from './dto/user-info.res.dto';
import { UserEnteredInfoResDto } from './dto/user-entered-info.res.dto.';

// консткакты пишутся в таком формате PAGIGANATION_LIMIT
// лучше переименовать в COUNT_USERS_ON_PAGE
const paginationLimit = 3;

@Injectable()
export class UserRepository {
  // Добавь токен в common, чтобы можно было переиспользовать его и внедрять везде правильный сервис
  constructor(@Inject('KYSELY_DB') private readonly db: Kysely<Database>) {}

  async getAll(): Promise<UserEnteredInfoResDto[]> {
    return await this.db
      .selectFrom('users')
      .select(['login', 'email', 'age', 'description'])
      .where('deleted_at', 'is', null)
      .execute();
  }

  async getAllPaginated(page: number): Promise<UserEnteredInfoResDto[]> {
    return await this.db
      .selectFrom('users')
      .select(['login', 'email', 'age', 'description'])
      .where('deleted_at', 'is', null)
      .offset((page - 1) * paginationLimit)
      .limit(paginationLimit)
      .execute();
  }

  async getAllWithDeleted(): Promise<User[]> {
    return await this.db.selectFrom('users').selectAll().execute();
  }

  // Весь репозиторий горит красным из-за типизации => что-то не так =)
  // Что-то не так = ты возвращаешь DTO, а не интерфейсы, что тебе предлагает Kysely. Используй их
  // Пример типизации export type UserByLogin = Pick<User, 'id' | 'login' | 'age' | 'description' | 'email' | 'password_hash'>
  // Promise<UserByLogin | undefined>
  async getByLogin(login: string): Promise<UserInfoResDto | undefined> {
    return await this.db
      .selectFrom('users')
      .select(['id', 'login', 'email', 'age', 'description', 'password_hash'])
      .where('deleted_at', 'is', null)
      .where('login', '=', login)
      .executeTakeFirst();
  }

  async getByLoginWithDeleted(login: string): Promise<User | undefined> {
    return await this.db
      .selectFrom('users')
      .selectAll()
      .where('login', '=', login)
      .executeTakeFirst();
  }

  async updateByLogin(login: string, data: UserUpdate): Promise<void> {
    await this.db
      .updateTable('users')
      .set(data)
      .where('deleted_at', 'is', null)
      .where('login', '=', login)
      .execute();
  }

  async removeByLogin(login: string): Promise<void> {
    await this.db
      .updateTable('users')
      .set({
        deleted_at: new Date(),
      })
      .where('deleted_at', 'is', null)
      .where('login', '=', login)
      .execute();
  }

  async removeHardByLogin(login: string): Promise<void> {
    await this.db.deleteFrom('users').where('login', '=', login).execute();
  }
}
