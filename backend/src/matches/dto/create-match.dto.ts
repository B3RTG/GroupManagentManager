import { IsDateString, IsString, IsInt, Min, IsUUID } from 'class-validator';

export class CreateMatchDto {
    @IsUUID()
    groupId: string;

    @IsDateString()
    date: string;

    @IsString()
    time: string;

    @IsString()
    sport: string;

    @IsInt()
    @Min(1)
    maxParticipants: number;

    @IsInt()
    @Min(0)
    maxSubstitutes: number;

    @IsUUID()
    createdBy: string;
}
