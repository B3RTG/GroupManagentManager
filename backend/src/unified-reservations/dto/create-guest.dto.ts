import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { GuestType } from '../entities/guest.entity';

export class CreateGuestDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsEnum(GuestType)
    type?: GuestType;

    @IsOptional()
    @IsUUID()
    createdBy?: string;
}
