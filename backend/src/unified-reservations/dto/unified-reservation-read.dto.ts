
import { Expose, Type } from 'class-transformer';
import { Group } from '../../groups/entities/group.entity';
import { Match } from '../../matches/entities/match.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { Participant, Guest } from '../entities';
import { DisponibilityDto } from './disponibility.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export class UnifiedReservationReadDto {
    @ApiProperty({ example: 'b1a2c3d4-5678-90ab-cdef-1234567890ab' })
    @Expose()
    id: string;

    @ApiProperty({ example: '2025-10-22T18:00:00.000Z' })
    @Expose()
    date: Date;

    @ApiProperty({ example: '18:00' })
    @Expose()
    time: string;

    @ApiProperty({ example: 'confirmed' })
    @Expose()
    status: string;

    @ApiPropertyOptional({ type: () => Group })
    @Expose()
    @Type(() => Group)
    group?: Group;

    @ApiPropertyOptional({ type: () => [Match] })
    @Expose()
    @Type(() => Match)
    matches?: Match[];

    @ApiPropertyOptional({ type: () => [Reservation] })
    @Expose()
    @Type(() => Reservation)
    reservations?: Reservation[];

    @ApiPropertyOptional({ type: () => [Participant] })
    @Expose()
    @Type(() => Participant)
    participants?: Participant[];

    @ApiPropertyOptional({ type: () => [Guest] })
    @Expose()
    @Type(() => Guest)
    guests?: Guest[];

    // Objeto de disponibilidad completo
    @ApiPropertyOptional({ type: () => DisponibilityDto })
    @Expose()
    disponibility?: DisponibilityDto;
}
