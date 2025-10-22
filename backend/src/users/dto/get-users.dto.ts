
import { IsInt, Min, Max, IsOptional, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetUsersDto {
  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit: number = 10;

  @ApiPropertyOptional({ example: 'juan', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'admin', required: false })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({ example: 'id,name,email', required: false })
  @IsOptional()
  @IsString()
  fields?: string;

  @ApiPropertyOptional({ example: 'name', required: false })
  @IsOptional()
  @IsString()
  orderBy?: string = 'name';

  @ApiPropertyOptional({ example: 'ASC', enum: ['ASC', 'DESC'], required: false })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  orderDir?: 'ASC' | 'DESC' = 'ASC';
}
