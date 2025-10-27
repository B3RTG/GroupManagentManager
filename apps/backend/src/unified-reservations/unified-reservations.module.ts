import { Module } from '@nestjs/common';
import { UnifiedReservationsController } from './unified-reservations.controller';
import { UnifiedReservationsService } from './unified-reservations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '../reservations/entities';
import { Match } from '../matches/entities';
import { UnifiedReservation, Guest, Participant } from './entities';
import { Group, GroupMembership } from '../groups/entities';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, UnifiedReservation, Guest, Participant, Group, GroupMembership, User, Match]),
  ],
  controllers: [UnifiedReservationsController],
  providers: [UnifiedReservationsService]
})
export class UnifiedReservationsModule { }
