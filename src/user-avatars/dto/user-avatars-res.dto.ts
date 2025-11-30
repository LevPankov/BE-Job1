import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserAvatarsResDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  avatar_path: string;

  @IsDate()
  created_at: Date;

  @IsDate()
  @IsOptional()
  deleted_at: Date | null;
}
