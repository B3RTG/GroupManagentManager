
import { IsOptional, IsString, IsEmail, IsArray, IsBoolean, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Nombre Apellido' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'usuario123' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ example: 'user@email.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: ['fútbol', 'tenis'], type: [String] })
  @IsOptional()
  @IsArray()
  preferredSports?: string[];

  @ApiPropertyOptional({ example: 'https://example.com/avatar.png' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: '+34123456789' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: '2025-10-22T12:34:56.789Z' })
  @IsOptional()
  @IsDateString()
  lastLogin?: string;

  // Puedes añadir más campos según la entidad User
}
