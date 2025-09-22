import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Database, NewUser, UserUpdate } from '../DB/types';
import { Kysely } from 'kysely';

@Injectable()
export class UserService {
    constructor(@Inject('KYSELY_DB') private readonly db: Kysely<Database>, ) {}
    
    async getAll() {
        return await this.db
        .selectFrom("users")
        .selectAll()
        .execute();
    }
    
    async getById(id : number) {
        const user = await this.db
        .selectFrom("users")
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst();
    
        if (!user) {
          throw new NotFoundException('User with ID ${id} not found');
        }
    
        return user;
    }
    
    async getByLogin(login : string) {
        const user = await this.db
        .selectFrom("users")
        .selectAll()
        .where('login', '=', login)
        .executeTakeFirst();
    
        if (!user) {
          throw new NotFoundException('User with ID ${id} not found');
        }
    
        return user;
    }
    
    async isInDb(login, password) {
        const user = await this.db
        .selectFrom("users")
        .selectAll()
        .where(({ eb, and }) => and([
            eb('login', '=', login),
            eb('password', '=', password)
        ]))
        .executeTakeFirst();

        return user != undefined;
    }

    async insert(data: NewUser) {
        if (!data.login || !data.email || !data.password || !data.age)
            throw new BadRequestException("Not enough data");

        const result = await this.db
        .insertInto('users')
        .values(data)
        .executeTakeFirst();
    
        if (!result){
          throw new Error('Not found id ${result}');
        }
    
        return "Success!";
    }
    
    async updateById(id: number, data: UserUpdate) {
        await this.db
        .updateTable('users')
        .set(data)
        .where('id', '=', id)
        .execute();
    }

    async updateByLogin(login: string, data: UserUpdate) {
        await this.db
        .updateTable('users')
        .set(data)
        .where('login', '=', login)
        .execute();
    }
    
    async removeById(id: number) {
        await this.db
        .deleteFrom("users")
        .where('id', '=', id)
        .execute();
    }

    async removeByLogin(login: string) {
        await this.db
        .deleteFrom("users")
        .where('login', '=', login)
        .execute();
    }
}
