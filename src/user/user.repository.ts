import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Database, NewUser, UserUpdate } from '../database/types';
import { Kysely } from 'kysely';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordService } from './password.service';

@Injectable()
export class UserRepository {
    constructor(
        private readonly passwordService: PasswordService,
        @Inject('KYSELY_DB') private readonly db: Kysely<Database>,
    ) {}
    
    async getAll(page: number) {
        if (page == -1) {
            return await this.db
            .selectFrom("users")
        .where('deleted_at', 'is', null)
            .select(['login', 'email', 'age', 'description'])
            .execute();
        }

        if (page < 1) {
            throw new BadRequestException("Page numbering starts from 1")
        }

        const limit = 3;
        return await this.db
            .selectFrom("users")
            .select(['login', 'email', 'age', 'description'])
        .where('deleted_at', 'is', null)
            .offset((page - 1) * limit)
            .limit(limit)
            .execute();
    }
    
    async getById(id : number) {
        const user = await this.db
        .selectFrom("users")
        .selectAll()
        .where('deleted_at', 'is', null)
        .where('id', '=', id)
        .executeTakeFirst();
    
        if (!user) {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
    
        return user;
    }
    
    async getByLogin(login : string) {
        const user = await this.db
        .selectFrom("users")
        .selectAll()
        .where('deleted_at', 'is', null)
        .where('login', '=', login)
        .executeTakeFirst();
    
        if (!user) {
          throw new NotFoundException(`User with login ${login} not found`);
        }
    
        return user;
    }
    
    async isInDb(login: string) {
        const user = await this.db
        .selectFrom("users")
        .select('id')
        .where('login', '=', login)
        .executeTakeFirst();

        return user != undefined;
    }

    async wasDeleted(login: string) {
        const userDeleteTimeClmn = await this.db
        .selectFrom("users")
        .select('deleted_at')
        .where('login', '=', login)
        .executeTakeFirst();

        const userDeleteTime = userDeleteTimeClmn?.deleted_at;
        return userDeleteTime != null && userDeleteTime != undefined;
    }

    async insert(data: CreateUserDto) {
        if (await this.isInDb(data.login)) {
            throw new BadRequestException(`Login ${data.login} is already exists`)
        }

        if (await this.wasDeleted(data.login)) {
            throw new BadRequestException(`Login ${data.login} was existed but deleted`)
        }

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
          throw new Error(`Not found id ${result}`);
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
    
        return "Success!";
    }

    async updateByLogin(login: string, data: Partial<CreateUserDto>) {
        if (!await this.isInDb(login)) {
            throw new BadRequestException('Login is incorrect')
        }
        
        if (await this.wasDeleted(login)) {
            throw new BadRequestException(`You can't update deleted profiles`)
        }
        
        const userUpdate: UserUpdate = {
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
    
        return "Success!";
    }
    
    async removeById(id: number) {
        await this.db
        .updateTable("users")
        .set({
            deleted_at: new Date
        })
        .where('id', '=', id)
        .execute();
    
        return "Success!";
    }

    async removeByLogin(login: string) {
        await this.db
        .updateTable("users")
        .set({
            deleted_at: new Date
        })
        .where('login', '=', login)
        .execute();
    
        return "Success!";
    }
}
