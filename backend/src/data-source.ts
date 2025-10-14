import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './users/entities/user.entity';
import { Group, GroupMembership, GroupInvitation } from './groups/entities';

import { Reservation, UnifiedReservation, Match, Guest, MatchParticipant } from './reservations/entities';


dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url:
    process.env.DATABASE_URL,
  entities: [User, Group, GroupMembership, GroupInvitation, UnifiedReservation, Reservation, Match, Guest, MatchParticipant],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
});
