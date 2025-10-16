import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenDto {
    @ApiProperty( {
        example: '261e30e0ee24cbb6e65bafda61b3b43d7f92794b2637ada6a058435138573a455f76575a038dd561'
    })
    @IsString()
    @IsNotEmpty()
    refresh_token: string;
}