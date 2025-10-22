
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { GroupRole } from '../entities/group-membership.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddMemberDto {
    @ApiProperty({ example: 'b1a2c3d4-5678-90ab-cdef-1234567890ab' })
    @IsString()
    userId: string;

    @ApiPropertyOptional({ enum: GroupRole, example: GroupRole.MEMBER })
    @IsOptional()
    @IsEnum(GroupRole)
    role?: GroupRole;
}