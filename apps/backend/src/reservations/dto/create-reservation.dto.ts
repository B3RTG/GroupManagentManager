import { IsUUID, IsDateString, IsString, IsInt, Min } from 'class-validator';

export class CreateReservationDto {
    @IsUUID()
    unifiedReservationId: string;

    @IsUUID()
    groupId: string;

    @IsUUID()
    createdBy: string;

    @IsDateString()
    date: string;

    // @IsString()
    // resourceId: string;

    @IsInt()
    @Min(1)
    slots: number;
}
