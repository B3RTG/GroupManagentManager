import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupRoles } from './decorators/group-roles.decorator';
import { GroupRoleGuard } from './guards/group-role.guard';
import { GroupRole } from './entities/group-membership.entity';
import type { Request } from 'express';
import type { User } from '../users/entities/user.entity';
import { AddMemberDto } from './dto/add-member.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createGroup(
    @Body() createGroupDto: CreateGroupDto,
    @Req() req: Request,
  ) {
    // req.user contiene el usuario autenticado
    if (!req.user) {
      throw new Error('Usuario autenticado no encontrado');
    }
    // Tipar el usuario como User & { role: string }
    const user = req.user as User & { role: string };
    return await this.groupsService.createGroup(createGroupDto, user);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getGroups(@Query('includeOwner') includeOwner?: string) {
    const withOwner = includeOwner === 'true';
    return await this.groupsService.getGroups(withOwner);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getGroup(@Param('id') id: string) {
    return await this.groupsService.getGroup(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), GroupRoleGuard)
  @GroupRoles(GroupRole.OWNER, GroupRole.ADMIN)
  async updateGroup(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return await this.groupsService.updateGroup(id, updateGroupDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), GroupRoleGuard)
  @GroupRoles(GroupRole.OWNER)
  async deleteGroup(@Param('id') id: string) {
    return await this.groupsService.deleteGroup(id);
  }


  /** Gestión de miembros */
  @Post(':id/members')
  @UseGuards(AuthGuard('jwt'), GroupRoleGuard)
  @GroupRoles(GroupRole.OWNER, GroupRole.ADMIN)
  async addMember(
    @Param('id') groupId: string,
    @Body() member: AddMemberDto
  ) {
    return await this.groupsService.addMember(groupId, member);
  }

  @Delete(':id/members/:userId')
  @UseGuards(AuthGuard('jwt'), GroupRoleGuard)
  @GroupRoles(GroupRole.OWNER, GroupRole.ADMIN, GroupRole.MEMBER)
  async removeMember(
    @Param('id') groupId: string,
    @Param('userId') userId: string,
    @Req() req: Request
  ) {
    const user = req.user as User & { groupRole: GroupRole };
    console.log('Current user role in group:', user);

    if (user.groupRole === GroupRole.MEMBER && user.id !== userId) {
      throw new ForbiddenException('No puedes eliminar a otros miembros si no eres administrador o propietario del grupo.');
    }
    return await this.groupsService.removeMember(groupId, userId);
  }

  @Get(':id/members')
  @UseGuards(AuthGuard('jwt'), GroupRoleGuard)
  @GroupRoles(GroupRole.OWNER, GroupRole.ADMIN, GroupRole.MEMBER)
  async listMembers(@Param('id') groupId: string) {
    return await this.groupsService.listMembers(groupId);
  }

  @Get(':id/owner')
  @UseGuards(AuthGuard('jwt'))
  @GroupRoles(GroupRole.OWNER, GroupRole.ADMIN, GroupRole.MEMBER)
  async getGroupOwner(@Param('id') groupId: string) {
    return await this.groupsService.getGroupOwner(groupId);
  }

  // metodo para cambiar el owner del grupo
  @Put(':id/owner/:userId')
  @UseGuards(AuthGuard('jwt'), GroupRoleGuard)
  @GroupRoles(GroupRole.OWNER)
  async changeGroupOwner(
    @Param('id') groupId: string,
    @Param('userId') userId: string,
  ) {
    return await this.groupsService.changeGroupOwner(groupId, userId);
  }

}
