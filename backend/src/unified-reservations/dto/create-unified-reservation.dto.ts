import { IsUUID, IsDateString, IsString, IsOptional } from 'class-validator';

export class CreateUnifiedReservationDto {
    @IsUUID()
    groupId: string;

    @IsDateString()
    date: string;

    @IsString()
    time: string;

    @IsOptional()
    @IsString()
    description?: string;
}
