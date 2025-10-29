import { User } from "../../providers/database/types";

export type UserInfo = Pick<User, 'id' | 'login' | 'email' | 'password_hash' | 'age' | 'description'>;
export type UserInfoWithoutPassword = Pick<User, 'id' | 'login' | 'email' | 'age' | 'description'>;
export type UserPublicInfo = Pick<User, 'login' | 'email' | 'age' | 'description'>;