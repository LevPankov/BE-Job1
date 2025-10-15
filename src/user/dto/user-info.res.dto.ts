import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Max, Min } from "class-validator";

export class UserInfoResDto {
    @IsNumber()
    @IsPositive()
    id: number;

    @IsString()
    @IsNotEmpty()
    login: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    password_hash: string;

    @IsNumber()
    @Min(1)
    @Max(100)
    age: number;
    
    @IsString()
    @IsOptional()
    description: string | null;
}