import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Min } from 'class-validator';

export class SendMoneyDto {
  @ApiProperty({
    default: 'login2',
  })
  @IsString()
  @IsNotEmpty()
  receiverLogin: string;

  @ApiProperty({
    example: 1.15,
    minimum: 0.01,
  })
  @Min(0.01)
  amount: number;
}
