import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateReservationDto {

    @IsString()
    @IsOptional()
    unifiedReservationId?: string;


    @IsString()
    groupId: string;

    @IsString()
    creatorId: string;

    @IsString()
    date: Date;

    @IsOptional()
    court?: number;
}
