import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './users/entities/user.entity';
import { Group, GroupMembership, GroupInvitation } from './groups/entities';
import { UnifiedReservation } from './unified-reservations/entities/unifiedReservation.entity';
import { Reservation } from './reservations/entities/reservation.entity';
import { Match } from './matches/entities/match.entity';
import { Guest } from './matches/entities/guest.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url:
    process.env.DATABASE_URL,
  entities: [User, Group, GroupMembership, GroupInvitation], //, UnifiedReservation, Reservation, Match, Guest
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
});
