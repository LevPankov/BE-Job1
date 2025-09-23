import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
    private readonly salt = bcrypt.genSalt();

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, await this.salt);
    }

    async validatePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
}