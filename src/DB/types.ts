import { Generated, ColumnType, Selectable, Insertable, Updateable } from 'kysely';

// Этот интерфейс описывает все таблицы в нашей базе данных.
export interface Database {
    users: UserTable; 
}

// Интерфейс, описывающий конкретно таблицу
export interface UserTable {
    id: Generated<number>; // Колонка 'id', тип number, с автоинкрементом (Generated)
    login: string;
    email: string;
    password: string;
    age: number;
    description: string | null;
    //created_at: ColumnType<Date, string | undefined, never>; // Колонка будет преобразована в Date объект, но в БД хранится как строка (TIMESTAMP)
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;