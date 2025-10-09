import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateGroupDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  allCanManageEvents?: boolean;
}
