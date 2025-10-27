
import { IsDateString, IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUnifiedReservationDto {
    @ApiPropertyOptional({ example: '2025-10-22' })
    @IsOptional()
    @IsDateString()
    date?: string;

    @ApiPropertyOptional({ example: '18:00' })
    @IsOptional()
    @IsString()
    time?: string;

    @ApiPropertyOptional({ example: 'Reserva para torneo' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ example: 'confirmed' })
    @IsOptional()
    @IsString()
    status?: string;
}
