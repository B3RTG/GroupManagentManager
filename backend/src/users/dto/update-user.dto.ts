import { IsOptional, IsString, IsEmail, IsArray } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsArray()
  preferredSports?: string[];

  // Puedes añadir más campos según la entidad User
}
