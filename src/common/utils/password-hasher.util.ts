import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
    const salt = bcrypt.genSalt();
    return await bcrypt.hash(password, await salt);
}

export const validatePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
}