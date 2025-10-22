
import { IsUUID, IsDateString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationForUnifiedDto {
    @ApiProperty({ example: 'b1a2c3d4-5678-90ab-cdef-1234567890ab' })
    @IsUUID()
    groupId: string;

    @ApiProperty({ example: 'b1a2c3d4-5678-90ab-cdef-1234567890ab' })
    @IsUUID()
    createdBy: string;

    @ApiProperty({ example: '2025-10-22' })
    @IsDateString()
    date: string;

    // @ApiProperty({ example: 'resource-id-123', required: false })
    // @IsString()
    // resourceId: string;

    @ApiProperty({ example: 4 })
    @IsInt()
    @Min(1)
    slots: number;
}
