import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { GroupMembership } from './entities/group-membership.entity';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { GroupRoleGuard } from './guards/group-role.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Group, GroupMembership])],
  providers: [GroupsService, GroupRoleGuard],
  controllers: [GroupsController],
})
export class GroupsModule {}
