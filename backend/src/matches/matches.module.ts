import { Module } from '@nestjs/common';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UnifiedReservation } from "../unified-reservations/entities/unified-reservation.entity";
import { Group } from '../groups/entities/group.entity';
import { Match, Player } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UnifiedReservation, Group, Match, Player]),
  ],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule { }
