import { IsNumber, Max, Min } from 'class-validator';

export class RemoveAvatarNumberDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  avatarNumber: number;
}
