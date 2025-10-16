import { IsDateString, IsString, IsInt, Min, IsOptional } from 'class-validator';

export class UpdateMatchDto {
    @IsOptional()
    @IsDateString()
    date?: string;

    @IsOptional()
    @IsString()
    time?: string;

    @IsOptional()
    @IsString()
    sport?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    maxParticipants?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    maxSubstitutes?: number;

    @IsOptional()
    @IsString()
    status?: string;
}
