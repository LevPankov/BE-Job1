import { Generated, Selectable, Insertable, Updateable } from 'kysely';

// Этот интерфейс описывает все таблицы в нашей базе данных.
export interface Database {
    users: UserTable; 
}

// Интерфейс, описывающий конкретно таблицу
export interface UserTable {
    id: Generated<number>;
    login: string;
    email: string;
    password: string;
    age: number;
    description: string | null;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;