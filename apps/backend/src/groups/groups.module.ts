import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { GroupRoleGuard } from './guards/group-role.guard';
import { Group, GroupMembership, GroupInvitation } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Group, GroupMembership, GroupInvitation])],
  providers: [GroupsService, GroupRoleGuard],
  controllers: [GroupsController],
})
export class GroupsModule { }
