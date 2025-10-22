import { Generated, Selectable, Insertable, Updateable } from 'kysely';

export interface Database {
  users: UserTable;
  refresh_tokens: RefreshTokenTable;
}

export interface UserTable {
  id: Generated<number>;
  login: string;
  email: string;
  password_hash: string;
  age: number;
  description: string | null;
  deleted_at: Date | null;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export interface RefreshTokenTable {
  id: Generated<number>;
  user_id: number;
  token: string;
  expires_at: Date;
  created_at: Generated<Date>;
  revoked: boolean;
}

export type RefreshToken = Selectable<RefreshTokenTable>;
export type NewRefreshToken = Insertable<RefreshTokenTable>;
export type RefreshTokenUpdate = Updateable<RefreshTokenTable>;
