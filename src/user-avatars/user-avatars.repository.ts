import { Inject, Injectable } from '@nestjs/common';
import { Database, NewUserAvatar, UserWithLatestAvatar } from '../providers/database/types';
import { Kysely } from 'kysely';
import { UserAvatarsResDto } from './dto/user-avatars-res.dto';
import { PROVIDERS } from '../common/constants/providers';

@Injectable()
export class UserAvatarsRepository {
  constructor(@Inject(PROVIDERS.DATABASE) private readonly db: Kysely<Database>) {}

  async getMostActiveUsersWithAvatars(minAvatarsCount: number, minAge: number, maxAge: number): Promise<UserWithLatestAvatar[]> {
    return (await this.db
      .selectFrom('users as u')
      .innerJoin(
        (eb) =>
          eb
            .selectFrom('users as u2')
            .innerJoin('user_avatars as ua', (join) => join.onRef('ua.user_id', '=', 'u2.id').on('ua.deleted_at', 'is', null))
            .select(['u2.id'])
            .where('u2.deleted_at', 'is', null)
            .where('u2.age', '>=', minAge)
            .where('u2.age', '<=', maxAge)
            .where('u2.description', 'is not', null)
            .groupBy('u2.id')
            .having((eb) => eb.fn.count('ua.id'), '>=', minAvatarsCount)
            .as('users_with_avatars'),
        (join) => join.onRef('users_with_avatars.id', '=', 'u.id'),
      )
      .innerJoin(
        (eb) =>
          eb
            .selectFrom('user_avatars as ua2')
            .distinctOn('ua2.user_id')
            .select(['ua2.user_id', 'ua2.avatar_path', 'ua2.created_at as avatar_created_at'])
            .where('ua2.deleted_at', 'is', null)
            .orderBy('ua2.user_id')
            .orderBy('ua2.created_at', 'desc')
            .as('latest_avatar'),
        (join) => join.onRef('latest_avatar.user_id', '=', 'u.id'),
      )
      .select(['u.id', 'u.login', 'u.email', 'u.age', 'u.description', 'latest_avatar.avatar_path'])
      .where('u.description', 'is not', null)
      .execute()) as UserWithLatestAvatar[];
  }

  async getAllUserAvatars(userId: string): Promise<UserAvatarsResDto[]> {
    return await this.db
      .selectFrom('user_avatars')
      .selectAll()
      .where((eb) => eb.and([eb('user_id', '=', userId), eb('deleted_at', 'is', null)]))
      .execute();
  }

  async getCountOfUserAvatars(userId: string): Promise<number> {
    const result = await this.db
      .selectFrom('user_avatars')
      .select(this.db.fn.count('id').as('count'))
      .where((eb) => eb.and([eb('user_id', '=', userId), eb('deleted_at', 'is', null)]))
      .executeTakeFirst();

    return Number(result?.count || 0);
  }

  async getAvatarById(id: string): Promise<UserAvatarsResDto | undefined> {
    return await this.db.selectFrom('user_avatars').selectAll().where('id', '=', id).executeTakeFirst();
  }

  async getAvatarByPath(path: string): Promise<UserAvatarsResDto | undefined> {
    return await this.db.selectFrom('user_avatars').selectAll().where('avatar_path', '=', path).executeTakeFirst();
  }

  async create(data: NewUserAvatar): Promise<void> {
    await this.db.insertInto('user_avatars').values(data).executeTakeFirst();
  }

  async removeUserAvatar(userId: string, avatarId: string): Promise<void> {
    await this.db
      .updateTable('user_avatars')
      .set({
        deleted_at: new Date(),
      })
      .where((eb) => eb.and([eb('user_id', '=', userId), eb('id', '=', avatarId), eb('deleted_at', 'is', null)]))
      .executeTakeFirst();
  }

  async removeHardUserAvatar(userId: string, avatarId: string): Promise<void> {
    await this.db
      .deleteFrom('user_avatars')
      .where((eb) => eb.and([eb('user_id', '=', userId), eb('id', '=', avatarId)]))
      .executeTakeFirst();
  }
}
