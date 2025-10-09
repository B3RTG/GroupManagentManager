import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  GroupMembership,
  GroupRole,
} from '../entities/group-membership.entity';
import { GROUP_ROLES_KEY } from '../decorators/group-roles.decorator';

@Injectable()
export class GroupRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(GroupMembership)
    private readonly membershipRepository: Repository<GroupMembership>,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<GroupRole[]>(
      GROUP_ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const groupId = request.params.id;

    if (request.user?.role === 'admin') {
      // Si el usuario es admin global, permitir el acceso
      request.user.groupRole = GroupRole.ADMIN;
      return true;
    }

    if (!userId || !groupId) {
      throw new ForbiddenException('User or group not found');
    }

    const membership = await this.membershipRepository.findOne({
      where: { user: { id: userId }, group: { id: groupId } },
    });

    if (!membership || !requiredRoles.includes(membership.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // Añadir el rol al usuario en la request
    request.user.groupRole = membership.role;

    return true;
  }
}
