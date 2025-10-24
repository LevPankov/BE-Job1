import { Generated, Selectable, Insertable, Updateable } from 'kysely';

export interface Database {
  users: UserTable;
  user_avatars: UserAvatarsTable;
  refresh_tokens: RefreshTokenTable;
}

export interface UserTable {
  id: Generated<string>;
  login: string;
  email: string;
  password_hash: string;
  age: number;
  description: string | null;
  created_at: Generated<Date>;
  deleted_at: Date | null;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export interface UserAvatarsTable {
  id: Generated<string>;
  user_id: string;
  avatar_path: string;
  created_at: Generated<Date>;
  deleted_at: Date | null;
}

export type UserAvatar = Selectable<UserAvatarsTable>;
export type NewUserAvatar = Insertable<UserAvatarsTable>;
export type UserAvatarUpdate = Updateable<UserAvatarsTable>;

export interface RefreshTokenTable {
  id: Generated<number>;
  user_id: string;
  token: string;
  expires_at: Date;
  created_at: Generated<Date>;
  revoked: boolean;
}

export type RefreshToken = Selectable<RefreshTokenTable>;
export type NewRefreshToken = Insertable<RefreshTokenTable>;
export type RefreshTokenUpdate = Updateable<RefreshTokenTable>;
