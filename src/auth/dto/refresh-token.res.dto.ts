import { Equals, IsJWT, IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenResDto {
    @IsJWT()
    @IsNotEmpty()
    access_token: string;

    @IsString()
    @IsNotEmpty()
    refresh_token: string;

    @IsString()
    @Equals('bearer')
    token_type: string;

    @IsString()
    @IsNotEmpty()
    expires_in: string;
}