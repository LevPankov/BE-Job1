import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository : UserRepository
    ) {}
    
    getAll(page: number) {
        return this.userRepository.getAll(page);
    }
    
    getById(id : number) {
        return this.userRepository.getById(id);
    }
    
    getByLogin(login : string) {
        return this.userRepository.getByLogin(login);
    }
    
    insert(data: CreateUserDto) {
        return this.userRepository.insert(data);
    }
    
    updateById(id: number, data: Partial<CreateUserDto>) {
        return this.userRepository.updateById(id, data);
    }

    updateByLogin(login: string, data: Partial<CreateUserDto>) {
       return this.userRepository.updateByLogin(login, data);
    }
    
    async removeById(id: number) {
        return this.userRepository.removeById(id);
    }

    async removeByLogin(login: string) {
        return this.userRepository.removeByLogin(login);
    }
}
