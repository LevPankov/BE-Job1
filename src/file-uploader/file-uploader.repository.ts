import { Inject, Injectable } from '@nestjs/common';
import { Database, NewUserAvatar } from '../providers/database/types';
import { Kysely } from 'kysely';
import { UserAvatarsResDto } from './dto/user-avatars-res.dto';

@Injectable()
export class FileUploaderRepository {
  constructor(@Inject('KYSELY_DB') private readonly db: Kysely<Database>) {}

  async getAllUserAvatars(userId: string): Promise<UserAvatarsResDto[]> {
    return await this.db
      .selectFrom('user_avatars')
      .selectAll()
      .where((eb) =>
        eb.and([eb('user_id', '=', userId), eb('deleted_at', 'is', null)]),
      )
      .execute();
  }

  async getCountOfUserAvatars(userId: string): Promise<number> {
    const result = await this.db
      .selectFrom('user_avatars')
      .select(this.db.fn.count('id').as('count'))
      .where((eb) =>
        eb.and([eb('user_id', '=', userId), eb('deleted_at', 'is', null)]),
      )
      .executeTakeFirst();

    return Number(result?.count || 0);
  }

  async getAvatarById(id: string): Promise<UserAvatarsResDto | undefined> {
    return await this.db
      .selectFrom('user_avatars')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async getAvatarByPath(path: string): Promise<UserAvatarsResDto | undefined> {
    return await this.db
      .selectFrom('user_avatars')
      .selectAll()
      .where('avatar_path', '=', path)
      .executeTakeFirst();
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
      .where((eb) =>
        eb.and([
          eb('user_id', '=', userId),
          eb('id', '=', avatarId),
          eb('deleted_at', 'is', null),
        ]),
      )
      .executeTakeFirst();
  }

  async removeHardUserAvatar(userId: string, avatarId: string): Promise<void> {
    await this.db
      .deleteFrom('user_avatars')
      .where((eb) =>
        eb.and([eb('user_id', '=', userId), eb('id', '=', avatarId)]),
      )
      .executeTakeFirst();
  }
}
