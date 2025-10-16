import { Module } from '@nestjs/common';
import { UnifiedReservationsController } from './unified-reservations.controller';
import { UnifiedReservationsService } from './unified-reservations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation, Match } from '../reservations/entities';
import { UnifiedReservation } from './entities/unified-reservation.entity';
import { Group, GroupMembership } from '../groups/entities';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, UnifiedReservation, Group, GroupMembership, User, Match]),
  ],
  controllers: [UnifiedReservationsController],
  providers: [UnifiedReservationsService]
})
export class UnifiedReservationsModule { }
