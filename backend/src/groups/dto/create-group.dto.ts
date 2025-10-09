import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  allCanManageEvents?: boolean;
}
