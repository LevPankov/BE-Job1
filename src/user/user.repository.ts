import { Inject, Injectable } from '@nestjs/common';
import { Database, NewUser, UserUpdate } from '../database/types';
import { Kysely } from 'kysely';

const paginationLimit = 3

@Injectable()
export class UserRepository {
    constructor(
        @Inject('KYSELY_DB') private readonly db: Kysely<Database>,
    ) {}
    
    async getAll() {
        return await this.db
            .selectFrom("users")
            .select(['login', 'email', 'age', 'description'])
            .where('deleted_at', 'is', null)
            .execute();
    }

    async getAllPaginated(page: number) {
        return await this.db
            .selectFrom("users")
            .select(['login', 'email', 'age', 'description'])
            .where('deleted_at', 'is', null)
            .offset((page - 1) * paginationLimit)
            .limit(paginationLimit)
            .execute();
    }
    
    async getAllWithDeleted() {
        return await this.db
            .selectFrom("users")
            .selectAll()
            .execute();
    }

    async getByLogin(login : string) {
        return await this.db
        .selectFrom("users")
        .select(['id', 'login', 'email', 'age', 'description', 'password_hash'])
        .where('deleted_at', 'is', null)
        .where('login', '=', login)
        .executeTakeFirst();
    }
    
    async getByLoginWithDeleted(login : string) {
        return await this.db
        .selectFrom("users")
        .selectAll()
        .where('login', '=', login)
        .executeTakeFirst();
    }

    async create(data: NewUser) {
        return await this.db
            .insertInto('users')
            .values(data)
            .executeTakeFirst();
    }
    
    async updateByLogin(login: string, data: UserUpdate) {
        await this.db
        .updateTable('users')
        .set(data)
        .where('login', '=', login)
        .execute();
    }
    
    async removeByLogin(login: string) {
        await this.db
        .updateTable("users")
        .set({
            deleted_at: new Date
        })
        .where('login', '=', login)
        .execute();
    }

    async removeHardByLogin(login: string) {
        await this.db
        .deleteFrom("users")
        .where('login', '=', login)
        .execute();
    }
}
