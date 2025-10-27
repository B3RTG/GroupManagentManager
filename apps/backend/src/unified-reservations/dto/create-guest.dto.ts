
import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { GuestType } from '../entities/guest.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGuestDto {
    @ApiProperty({ example: 'Invitado 1' })
    @IsString()
    name: string;

    @ApiPropertyOptional({ example: 'invitado@email.com' })
    @IsOptional()
    @IsString()
    email?: string;

    @ApiPropertyOptional({ enum: GuestType, example: GuestType.PRINCIPAL })
    @IsOptional()
    @IsEnum(GuestType)
    type?: GuestType;

    @ApiPropertyOptional({ example: 'b1a2c3d4-5678-90ab-cdef-1234567890ab' })
    @IsOptional()
    @IsUUID()
    createdBy?: string;
}
