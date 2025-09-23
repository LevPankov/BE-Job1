import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Database, NewUser, UserUpdate } from '../DB/types';
import { Kysely } from 'kysely';
import { CreateUserDto } from 'src/Dto/create-user.dto';
import { PasswordService } from './password.service';

@Injectable()
export class UserService {
    constructor(
        private readonly passwordService: PasswordService,
        @Inject('KYSELY_DB') private readonly db: Kysely<Database>,
    ) {}
    
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
        const hashPassword = await this.passwordService.hashPassword(password);

        const user = await this.db
        .selectFrom("users")
        .selectAll()
        .where(({ eb, and }) => and([
            eb('login', '=', login),
            eb('password_hash', '=', hashPassword)
        ]))
        .executeTakeFirst();

        return user != undefined;
    }

    async insert(data: CreateUserDto) {
        const hashPassword = await this.passwordService.hashPassword(data.password);
        const newUser: NewUser = {
            login: data.login,
            email: data.email,
            password_hash: hashPassword,
            age: data.age,
            description: data.description
        }
        
        const result = await this.db
        .insertInto('users')
        .values(newUser)
        .executeTakeFirst();
    
        if (!result){
          throw new Error('Not found id ${result}');
        }
    
        return "Success!";
    }
    
    async updateById(id: number, data: Partial<CreateUserDto>) {
        const userUpdate: UserUpdate = {
            login: data.login,
            email: data.email,
            age: data.age,
            description: data.description
        };
        if (data.password) {
            userUpdate.password_hash = await this.passwordService.hashPassword(data.password);
        }

        await this.db
        .updateTable('users')
        .set(userUpdate)
        .where('id', '=', id)
        .execute();
    }

    async updateByLogin(login: string, data: Partial<CreateUserDto>) {
        const userUpdate: UserUpdate = {
            login: data.login,
            email: data.email,
            age: data.age,
            description: data.description
        };
        if (data.password) {
            userUpdate.password_hash = await this.passwordService.hashPassword(data.password);
        }

        await this.db
        .updateTable('users')
        .set(userUpdate)
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
