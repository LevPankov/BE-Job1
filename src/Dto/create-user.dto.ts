import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    login: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsNumber()
    @Min(1)
    @Max(100)
    age: number;
    
    @IsString()
    @IsOptional()
    description: string;
}