
import { IsUUID, IsDateString, IsInt, Min } from 'class-validator';

export class CreateReservationForUnifiedDto {
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
