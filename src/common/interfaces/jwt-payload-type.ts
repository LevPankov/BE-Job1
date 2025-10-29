export interface JwtPayload {
    sub: string;
    login: string;
    iat?: number;
    exp?: number;
}