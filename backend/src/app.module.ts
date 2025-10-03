import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { UnifiedReservationsModule } from './unified-reservations/unified-reservations.module';
import { ReservationsModule } from './reservations/reservations.module';
import { MatchesModule } from './matches/matches.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgresql://postgres.qurvisggjfueprxahzsa:qHCEz6Ji>>k6@aws-1-eu-west-3.pooler.supabase.com:6543/postgres',
      entities: [User],
      synchronize: false,
    }),
    AuthModule,
    UsersModule,
    GroupsModule,
    UnifiedReservationsModule,
    ReservationsModule,
    MatchesModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
