import * as bcrypt from 'bcrypt';

// Вроде сервис, а вроде находится в утилитах. Странно
// Утилита обычно = какая-то отдельная функция
// У тебя выглядит как сервис. Вынеси тогда в отдельный модуль, мб hasher
export class PasswordService {
    static async hashPassword(password: string): Promise<string> {
        const salt = bcrypt.genSalt();
        return await bcrypt.hash(password, await salt);
    }

    static async validatePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
}