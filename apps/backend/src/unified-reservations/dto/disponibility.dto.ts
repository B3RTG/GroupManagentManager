import { ApiProperty } from '@nestjs/swagger';

export class DisponibilityDto {
    @ApiProperty({ example: 16 })
    totalSlots: number;

    @ApiProperty({ example: 4 })
    availableSlots: number;

    @ApiProperty({ example: 12 })
    currentOccupancy: number;

    @ApiProperty({ example: 2 })
    substitutes: number;
}
