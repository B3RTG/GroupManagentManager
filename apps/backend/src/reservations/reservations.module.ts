import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { UnifiedReservation } from '../unified-reservations/entities/unified-reservation.entity';
import { Group } from '../groups/entities/group.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, UnifiedReservation, Group, User]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService]
})
export class ReservationsModule { }
