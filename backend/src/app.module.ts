import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Group } from './groups/entities/group.entity';
import { GroupMembership } from './groups/entities/group-membership.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { UnifiedReservationsModule } from './unified-reservations/unified-reservations.module';
import { ReservationsModule } from './reservations/reservations.module';
import { MatchesModule } from './matches/matches.module';
import { NotificationsModule } from './notifications/notifications.module';
import { GroupInvitation } from './groups/entities/group-invitation.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [User, Group, GroupMembership, GroupInvitation],
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
