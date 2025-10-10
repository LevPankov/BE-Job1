import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { PasswordService } from '../utils/password-hasher.util';
import { NewUser, UserUpdate } from '../database/types';
import { UserInDbStatus } from '../utils/user-in-db-status.enum';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository : UserRepository,
    ) {}
    
    async getAll(page: number) {
        if (page == -1) {
            return await this.userRepository.getAll();
        }

        if (page == -2) {
            return await this.userRepository.getAllWithDeleted();
        }

        if (page < 1) {
            throw new BadRequestException("Page numbering starts from 1")
        }

        return await this.userRepository.getAllPaginated(page);
    }
    
    async getByLogin(login : string) {
        const user = await this.userRepository.getByLogin(login);
        
        if (!user) {
          throw new NotFoundException(`User with login ${login} not found`);
        }
    
        return user;
    }
    
    async create(data: CreateUserDto) {
        switch(await this.chechStatusInDb(data.login)) {
            case UserInDbStatus.ACTIVE: 
                throw new BadRequestException(`Login ${data.login} is already exists`);
            case UserInDbStatus.DELETED:
                throw new BadRequestException(`Login ${data.login} was existed but deleted`)
        }
        
        const hashPassword = await PasswordService.hashPassword(data.password);
        const newUser: NewUser = {
            login: data.login,
            email: data.email,
            password_hash: hashPassword,
            age: data.age,
            description: data.description
        }
        
        await this.userRepository.create(newUser);
    }
    
    async updateByLogin(login: string, data: Partial<CreateUserDto>) {
        switch(await this.chechStatusInDb(login)) {
            case UserInDbStatus.NOT_FOUND: 
                throw new BadRequestException('Login is incorrect')
            case UserInDbStatus.DELETED:
                throw new BadRequestException(`You can't update deleted profiles`)
        }
        
        const userUpdate: UserUpdate = {
            email: data.email,
            age: data.age,
            description: data.description
        };
        if (data.password) {
            userUpdate.password_hash = await PasswordService.hashPassword(data.password);
        }

       return this.userRepository.updateByLogin(login, userUpdate);
    }
    
    removeByLogin(login: string) {
        return this.userRepository.removeByLogin(login);
    }

    removeHardByLogin(login: string) {
        return this.userRepository.removeHardByLogin(login);
    }

    async chechStatusInDb(login: string) : Promise<UserInDbStatus> {
        const user = await this.userRepository.getByLoginWithDeleted(login);
        if (!user){
            return UserInDbStatus.NOT_FOUND;
        }
        const userDeleteTime = user?.deleted_at;
        if (userDeleteTime == null) {
            return UserInDbStatus.ACTIVE;
        }
        return UserInDbStatus.DELETED;
    }
}
