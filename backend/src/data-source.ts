import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './users/entities/user.entity';
import { Group, GroupMembership, GroupInvitation } from './groups/entities';
import { UnifiedReservation, Participant, Guest } from './unified-reservations/entities';
import { Reservation } from './reservations/entities';
import { Match, Player } from './matches/entities';


dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url:
    process.env.DATABASE_URL,
  entities: [User, Group, GroupMembership, GroupInvitation, UnifiedReservation, Participant, Guest, Reservation, Match, Player],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
});
