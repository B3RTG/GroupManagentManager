import { Module } from '@nestjs/common';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UnifiedReservation } from '../unified-reservations/entities/unifiedReservation.entity';
import { Group } from '../groups/entities/group.entity';
import { Guest } from './entities/guest.entity';
import { Match } from './entities/match.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UnifiedReservation, Group, Guest, Match]),
  ],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule { }
