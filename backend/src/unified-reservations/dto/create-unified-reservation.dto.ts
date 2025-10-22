
import { IsUUID, IsDateString, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUnifiedReservationDto {
    @ApiProperty({ example: 'b1a2c3d4-5678-90ab-cdef-1234567890ab' })
    @IsUUID()
    groupId: string;

    @ApiProperty({ example: '2025-10-22' })
    @IsDateString()
    date: string;

    @ApiProperty({ example: '18:00' })
    @IsString()
    time: string;

    @ApiPropertyOptional({ example: 'Reserva para torneo' })
    @IsOptional()
    @IsString()
    description?: string;
}
