import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
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
    
    async getAll(page: number) {
        if (page == -1) {
            return await this.db
            .selectFrom("users")
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
            .offset((page - 1) * limit)
            .limit(limit)
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
    
    async isInDb(login: string) {
        const user = await this.db
        .selectFrom("users")
        .select('id')
        .where('login', '=', login)
        .executeTakeFirst();

        return user != undefined;
    }

    async insert(data: CreateUserDto) {
        if (await this.isInDb(data.login)) {
            throw new BadRequestException('This login already exists')
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
    
        return "Success!";
    }

    async updateByLogin(login: string, data: Partial<CreateUserDto>) {
        if (!await this.isInDb(login)) {
            throw new BadRequestException('Login is incorrect')
        }
        
        const userUpdate: UserUpdate = {
            login: data.login,
            email: data.email,
            age: data.age,
            description: data.description
        };
        if (data.login && await this.isInDb(data.login)) {
            throw new BadRequestException("You can't change login to this")
        }
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
        .deleteFrom("users")
        .where('id', '=', id)
        .execute();
    
        return "Success!";
    }

    async removeByLogin(login: string) {
        await this.db
        .deleteFrom("users")
        .where('login', '=', login)
        .execute();
    
        return "Success!";
    }
}
