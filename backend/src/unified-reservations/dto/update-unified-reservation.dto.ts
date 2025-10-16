import { IsDateString, IsString, IsOptional } from 'class-validator';

export class UpdateUnifiedReservationDto {
    @IsOptional()
    @IsDateString()
    date?: string;

    @IsOptional()
    @IsString()
    time?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    status?: string;
}
