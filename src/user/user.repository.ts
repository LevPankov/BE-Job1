import { Inject, Injectable } from '@nestjs/common';
import { Database, User, UserUpdate } from '../database/types';
import { Kysely } from 'kysely';
import { UserInfoResDto } from './dto/user-info.res.dto';
import { UserEnteredInfoResDto } from './dto/user-entered-info.res.dto.';

const paginationLimit = 3

@Injectable()
export class UserRepository {
    constructor(
        @Inject('KYSELY_DB') private readonly db: Kysely<Database>,
    ) {}
    
    async getAll(): Promise<UserEnteredInfoResDto[]>  {
        return await this.db
            .selectFrom("users")
            .select(['login', 'email', 'age', 'description'])
            .where('deleted_at', 'is', null)
            .execute();
    }

    async getAllPaginated(page: number): Promise<UserEnteredInfoResDto[]> {
        return await this.db
            .selectFrom("users")
            .select(['login', 'email', 'age', 'description'])
            .where('deleted_at', 'is', null)
            .offset((page - 1) * paginationLimit)
            .limit(paginationLimit)
            .execute();
    }
    
    async getAllWithDeleted(): Promise<User[]> {
        return await this.db
            .selectFrom("users")
            .selectAll()
            .execute();
    }

    async getByLogin(login : string): Promise<UserInfoResDto | undefined> {
        return await this.db
            .selectFrom("users")
            .select(['id', 'login', 'email', 'age', 'description', 'password_hash'])
            .where('deleted_at', 'is', null)
            .where('login', '=', login)
            .executeTakeFirst();
    }
    
    async getByLoginWithDeleted(login : string): Promise<User | undefined> {
        return await this.db
            .selectFrom("users")
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
            .updateTable("users")
            .set({
                deleted_at: new Date
            })
            .where('deleted_at', 'is', null)
            .where('login', '=', login)
            .execute();
    }

    async removeHardByLogin(login: string): Promise<void> {
        await this.db
            .deleteFrom("users")
            .where('login', '=', login)
            .execute();
    }
}
