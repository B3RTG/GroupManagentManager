import { IsString, IsOptional, IsEnum } from 'class-validator';
import { GroupRole } from '../entities/group-membership.entity';

export class AddMemberDto {
    @IsString()
    userId: string;

    @IsOptional()
    @IsEnum(GroupRole)
    role?: GroupRole;
}