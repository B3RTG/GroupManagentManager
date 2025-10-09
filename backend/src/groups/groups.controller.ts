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

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

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
}
