import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './users/entities/user.entity';
import { Group } from './groups/entities/group.entity';
import { GroupMembership } from './groups/entities/group-membership.entity';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url:
    process.env.DATABASE_URL ||
    'postgresql://postgres.qurvisggjfueprxahzsa:qHCEz6Ji>>k6@aws-1-eu-west-3.pooler.supabase.com:6543/postgres',
  entities: [User, Group, GroupMembership],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
});
