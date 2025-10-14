import { Module } from '@nestjs/common';
import { UnifiedReservationsController } from './unified-reservations.controller';
import { UnifiedReservationsService } from './unified-reservations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '../reservations/entities/reservation.entity';
import { UnifiedReservation } from './entities/unified-reservation.entity';
import { Group } from '../groups/entities/group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, UnifiedReservation, Group]),
  ],
  controllers: [UnifiedReservationsController],
  providers: [UnifiedReservationsService]
})
export class UnifiedReservationsModule { }
