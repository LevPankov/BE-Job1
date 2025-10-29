import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SignInDto {
    @ApiProperty({
        default: 'login'
    })
    @IsString()
    @IsNotEmpty()
    login: string;

    @ApiProperty({
        default: 'qwerty'
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}