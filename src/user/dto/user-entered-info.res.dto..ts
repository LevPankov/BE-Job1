import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Max, Min } from "class-validator";

export class UserEnteredInfoResDto {
    @IsString()
    @IsNotEmpty()
    login: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsNumber()
    @Min(1)
    @Max(100)
    age: number;
    
    @IsString()
    @IsOptional()
    description: string | null;
}