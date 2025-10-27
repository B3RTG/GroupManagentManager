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
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('groups')
@ApiBearerAuth()
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) { }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo grupo' })
  @ApiBody({ type: CreateGroupDto })
  @ApiResponse({ status: 201, description: 'Grupo creado correctamente.' })
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
  @ApiOperation({ summary: 'Listar grupos' })
  @ApiQuery({ name: 'includeOwner', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Lista de grupos.' })
  @UseGuards(AuthGuard('jwt'))
  async getGroups(@Query('includeOwner') includeOwner?: string) {
    const withOwner = includeOwner === 'true';
    return await this.groupsService.getGroups(withOwner);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener grupo por ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Grupo encontrado.' })
  @UseGuards(AuthGuard('jwt'))
  async getGroup(@Param('id') id: string) {
    return await this.groupsService.getGroup(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar grupo por ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateGroupDto })
  @ApiResponse({ status: 200, description: 'Grupo actualizado.' })
  @UseGuards(AuthGuard('jwt'), GroupRoleGuard)
  @GroupRoles(GroupRole.OWNER, GroupRole.ADMIN)
  async updateGroup(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return await this.groupsService.updateGroup(id, updateGroupDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar grupo por ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Grupo eliminado.' })
  @UseGuards(AuthGuard('jwt'), GroupRoleGuard)
  @GroupRoles(GroupRole.OWNER)
  async deleteGroup(@Param('id') id: string) {
    return await this.groupsService.deleteGroup(id);
  }


  /** Gestión de miembros */
  @Post(':id/members')
  @ApiOperation({ summary: 'Añadir miembro a grupo' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: AddMemberDto })
  @ApiResponse({ status: 201, description: 'Miembro añadido.' })
  @UseGuards(AuthGuard('jwt'), GroupRoleGuard)
  @GroupRoles(GroupRole.OWNER, GroupRole.ADMIN)
  async addMember(
    @Param('id') groupId: string,
    @Body() member: AddMemberDto
  ) {
    return await this.groupsService.addMember(groupId, member);
  }

  @Delete(':id/members/:userId')
  @ApiOperation({ summary: 'Eliminar miembro de grupo' })
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'userId', type: String })
  @ApiResponse({ status: 200, description: 'Miembro eliminado.' })
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
  @ApiOperation({ summary: 'Listar miembros de grupo' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Lista de miembros.' })
  @UseGuards(AuthGuard('jwt'), GroupRoleGuard)
  @GroupRoles(GroupRole.OWNER, GroupRole.ADMIN, GroupRole.MEMBER)
  async listMembers(@Param('id') groupId: string) {
    return await this.groupsService.listMembers(groupId);
  }

  @Get(':id/owner')
  @ApiOperation({ summary: 'Obtener propietario del grupo' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Propietario del grupo.' })
  @UseGuards(AuthGuard('jwt'))
  @GroupRoles(GroupRole.OWNER, GroupRole.ADMIN, GroupRole.MEMBER)
  async getGroupOwner(@Param('id') groupId: string) {
    return await this.groupsService.getGroupOwner(groupId);
  }

  // metodo para cambiar el owner del grupo
  @Put(':id/owner/:userId')
  @ApiOperation({ summary: 'Cambiar propietario del grupo' })
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'userId', type: String })
  @ApiResponse({ status: 200, description: 'Propietario cambiado.' })
  @UseGuards(AuthGuard('jwt'), GroupRoleGuard)
  @GroupRoles(GroupRole.OWNER)
  async changeGroupOwner(
    @Param('id') groupId: string,
    @Param('userId') userId: string,
  ) {
    return await this.groupsService.changeGroupOwner(groupId, userId);
  }

  @Put(':id/members/:userId/role')
  @ApiOperation({ summary: 'Actualizar rol de miembro en grupo' })
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'userId', type: String })
  @ApiBody({ schema: { properties: { role: { type: 'string', enum: Object.values(GroupRole) } } } })
  @ApiResponse({ status: 200, description: 'Rol actualizado.' })
  @UseGuards(AuthGuard('jwt'), GroupRoleGuard)
  @GroupRoles(GroupRole.OWNER, GroupRole.ADMIN)
  async updateMemberRole(
    @Param('id') groupId: string,
    @Param('userId') userId: string,
    @Body() body: { role: GroupRole }
  ) {
    return await this.groupsService.updateMemberRole(groupId, userId, body.role);
  }

  /** Gestión de invitaciones */
  @Post(':id/invitations')
  @ApiOperation({ summary: 'Crear invitación a grupo' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        invitedUserId: { type: 'string' },
        expiresAt: { type: 'string', format: 'date-time' }
      },
      required: []
    }
  })
  @ApiResponse({ status: 201, description: 'Invitación creada.' })
  @UseGuards(AuthGuard('jwt'), GroupRoleGuard)
  @GroupRoles(GroupRole.OWNER, GroupRole.ADMIN)
  async createInvitation(
    @Param('id') groupId: string,
    @Body() body: { invitedUserId?: string; expiresAt?: string }
  ) {
    console.log('Creating invitation with body:', body);
    return await this.groupsService.createInvitation(
      groupId,
      body.invitedUserId !== undefined ? body.invitedUserId : null,
      body.expiresAt ? new Date(body.expiresAt) : null
    );
  }
  @Get(':id/invitations')
  @ApiOperation({ summary: 'Listar invitaciones de grupo' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Lista de invitaciones.' })
  @UseGuards(AuthGuard('jwt'), GroupRoleGuard)
  @GroupRoles(GroupRole.OWNER, GroupRole.ADMIN, GroupRole.MEMBER)
  async listInvitations(@Param('id') groupId: string) {
    return await this.groupsService.listInvitations(groupId);
  }

  @Post(':id/invitations/:invitationId/accept')
  @ApiOperation({ summary: 'Aceptar invitación a grupo' })
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'invitationId', type: String })
  @ApiResponse({ status: 200, description: 'Invitación aceptada.' })
  @UseGuards(AuthGuard('jwt'))
  async acceptInvitation(
    @Param('id') groupId: string,
    @Param('invitationId') invitationId: string,
    @Req() req: Request
  ) {
    const user = req.user as User & { role: string };
    return await this.groupsService.acceptInvitation(invitationId, user.id);
  }

  @Post(':id/invitations/:invitationId/decline')
  @ApiOperation({ summary: 'Rechazar invitación a grupo' })
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'invitationId', type: String })
  @ApiResponse({ status: 200, description: 'Invitación rechazada.' })
  @UseGuards(AuthGuard('jwt'))
  async declineInvitation(
    @Param('id') groupId: string,
    @Param('invitationId') invitationId: string,
    @Req() req: Request
  ) {
    const user = req.user as User & { role: string };
    return await this.groupsService.declineInvitation(invitationId, user.id);
  }

}
