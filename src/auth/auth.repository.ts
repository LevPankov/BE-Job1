import { Inject, Injectable } from '@nestjs/common';
import { Database, NewRefreshToken, NewUser, RefreshToken, User } from '../providers/database/types';
import { Kysely } from 'kysely';
import { PROVIDERS } from '../common/constants/providers';
import { UserInfo } from '../common/interfaces/user-db-types';

@Injectable()
export class AuthRepository {
  constructor(@Inject(PROVIDERS.DATABASE) private readonly db: Kysely<Database>) { }

  async create(data: NewUser): Promise<void> {
    await this.db.insertInto('users').values(data).executeTakeFirst();
  }

  async getById(id: string): Promise<UserInfo | undefined> {
    return await this.db
      .selectFrom('users')
      .select(['id', 'login', 'email', 'age', 'description', 'password_hash'])
      .where('deleted_at', 'is', null)
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async getByLogin(login: string): Promise<UserInfo | undefined> {
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

  async createToken(data: NewRefreshToken): Promise<void> {
    await this.db
      .insertInto('refresh_tokens')
      .values({
        user_id: data.user_id,
        token: data.token,
        expires_at: data.expires_at,
        revoked: data.revoked,
      })
      .execute();
  }

  async getValidToken(token: string): Promise<RefreshToken | undefined> {
    return await this.db
      .selectFrom('refresh_tokens')
      .selectAll()
      .where('token', '=', token)
      .where('revoked', '=', false)
      .where('expires_at', '>', new Date())
      .executeTakeFirst();
  }

  async revokeToken(token: string): Promise<void> {
    await this.db
      .updateTable('refresh_tokens')
      .set({ revoked: true })
      .where('token', '=', token)
      .execute();
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.db
      .updateTable('refresh_tokens')
      .set({ revoked: true })
      .where('user_id', '=', userId)
      .execute();
  }

  async deleteExpiredTokens(): Promise<void> {
    await this.db
      .deleteFrom('refresh_tokens')
      .where('expires_at', '<', new Date())
      .execute();
  }
}
