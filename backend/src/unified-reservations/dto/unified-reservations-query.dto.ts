
import { IsOptional, IsBooleanString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UnifiedReservationsQueryDto {
    @ApiPropertyOptional({ example: 'true' })
    @IsOptional()
    @IsBooleanString()
    includeGroup?: string;

    @ApiPropertyOptional({ example: 'true' })
    @IsOptional()
    @IsBooleanString()
    includeMatches?: string;

    @ApiPropertyOptional({ example: 'true' })
    @IsOptional()
    @IsBooleanString()
    includeReservations?: string;

    @ApiPropertyOptional({ example: 'true' })
    @IsOptional()
    @IsBooleanString()
    includeParticipantsAndGuests?: string;
}
