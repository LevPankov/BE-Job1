import * as bcrypt from 'bcrypt';

export class PasswordService {
    static async hashPassword(password: string): Promise<string> {
        const salt = bcrypt.genSalt();
        return await bcrypt.hash(password, await salt);
    }

    static async validatePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
}