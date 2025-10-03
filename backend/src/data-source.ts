import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url:
    process.env.DATABASE_URL ||
    'postgresql://postgres.qurvisggjfueprxahzsa:qHCEz6Ji>>k6@aws-1-eu-west-3.pooler.supabase.com:6543/postgres',
  entities: ['dist/**/entities/*.js'],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
});
