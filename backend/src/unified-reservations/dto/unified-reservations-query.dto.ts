
import { IsOptional, IsBooleanString } from 'class-validator';

export class UnifiedReservationsQueryDto {
    @IsOptional()
    @IsBooleanString()
    includeGroup?: string;

    @IsOptional()
    @IsBooleanString()
    includeMatches?: string;

    @IsOptional()
    @IsBooleanString()
    includeReservations?: string;

    @IsOptional()
    @IsBooleanString()
    includeParticipantsAndGuests?: string = 'true';
}
