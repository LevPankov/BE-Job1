import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { PasswordService } from '../utils/password-hasher.util';
import { UserUpdate } from '../database/types';

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
    
    async updateByLogin(login: string, data: UpdateUserDto) {
        const user = await this.userRepository.getByLoginWithDeleted(login);
        if (!user){
            throw new BadRequestException('Login is incorrect')
        }
        if (user.deleted_at != null) {
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
}
