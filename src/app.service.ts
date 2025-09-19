import { Injectable } from '@nestjs/common';
import { User } from './Interfaces/user.interface'

@Injectable()
export class AppService {
  private readonly users: User[] = [];

  create(user: User){
    this.users.push(user);
  }

  getAll(): User[] {
    return this.users;
  }
}
