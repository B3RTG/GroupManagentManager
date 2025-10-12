import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './users/entities/user.entity';
import { Group } from './groups/entities/group.entity';
import { GroupMembership } from './groups/entities/group-membership.entity';
import { GroupInvitation } from './groups/entities/group-invitation.entity';
import { UnifiedReservation } from './unified-reservations/entities/unifiedReservation.entity';
import { Reservation } from './reservations/entities/reservation.entity';
import { Match } from './matches/entities/match.entity';
import { Guest } from './matches/entities/guest.entity';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url:
    process.env.DATABASE_URL ||
    'postgresql://postgres.qurvisggjfueprxahzsa:qHCEz6Ji>>k6@aws-1-eu-west-3.pooler.supabase.com:6543/postgres',
  entities: [User, Group, GroupMembership, GroupInvitation, UnifiedReservation, Reservation, Match, Guest],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
});
