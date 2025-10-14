import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// controllers
//import { AppController } from './app.controller';
// services
//import { AppService } from './app.service';

// modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { UnifiedReservationsModule } from './unified-reservations/unified-reservations.module';
import { ReservationsModule } from './reservations/reservations.module';
import { MatchesModule } from './matches/matches.module';
import { NotificationsModule } from './notifications/notifications.module';

// entities
import { User } from './users/entities/user.entity';
import { Group, GroupMembership, GroupInvitation } from './groups/entities';
import { Reservation, UnifiedReservation, Match, Guest, MatchParticipant } from './reservations/entities';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [User, Group, GroupMembership, GroupInvitation, UnifiedReservation, Reservation, Match, Guest, MatchParticipant],
        synchronize: false,
      }),
    }),
    AuthModule,
    UsersModule,
    GroupsModule,
    UnifiedReservationsModule,
    ReservationsModule,
    MatchesModule,
    NotificationsModule,
  ],
  controllers: [], //AppController
  providers: [], //AppService
})
export class AppModule { }
