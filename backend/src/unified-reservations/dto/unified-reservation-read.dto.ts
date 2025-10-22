import { Expose, Type } from 'class-transformer';
import { Group } from '../../groups/entities/group.entity';
import { Match } from '../../matches/entities/match.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { Participant, Guest } from '../entities';
import { DisponibilityDto } from './disponibility.dto';


export class UnifiedReservationReadDto {
    @Expose()
    id: string;

    @Expose()
    date: Date;

    @Expose()
    time: string;

    @Expose()
    status: string;

    @Expose()
    @Type(() => Group)
    group?: Group;

    @Expose()
    @Type(() => Match)
    matches?: Match[];

    @Expose()
    @Type(() => Reservation)
    reservations?: Reservation[];

    @Expose()
    @Type(() => Participant)
    participants?: Participant[];

    @Expose()
    @Type(() => Guest)
    guests?: Guest[];

    // Objeto de disponibilidad completo
    @Expose()
    disponibility?: DisponibilityDto;
}
