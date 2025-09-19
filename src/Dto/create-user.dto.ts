import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    login: string;

    @IsString()
    email: string;
    
    @IsString()
    password: string;

    @IsNumber()
    age: number;
    
    @IsString()
    @IsOptional()
    description: string;
}