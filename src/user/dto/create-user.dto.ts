import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty( {
        default: 'login'
    })
    @IsString()
    @IsNotEmpty()
    login: string;

    @ApiProperty( {
        default: 'email@mail.com'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @ApiProperty( {
        minLength: 6,
        default: 'qwerty'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty( {
        minimum: 1,
        maximum: 100
    })
    @IsNumber()
    @Min(1)
    @Max(100)
    age: number;
    
    @ApiProperty( {
        required: false
    })
    @IsString()
    @IsOptional()
    description: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}