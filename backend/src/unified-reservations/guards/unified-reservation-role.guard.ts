import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GROUP_ROLES_KEY } from '../decorators/group-roles.decorator';
import { UnifiedReservation } from '../entities/unified-reservation.entity';
import { Group } from '../../groups/entities/group.entity';
import { GroupMembership, GroupRole } from '../../groups/entities/group-membership.entity';

@Injectable()
export class UnifiedReservationRoleGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @InjectRepository(UnifiedReservation)
        private readonly unifiedReservationRepo: Repository<UnifiedReservation>,
        @InjectRepository(Group)
        private readonly groupRepo: Repository<Group>,
        @InjectRepository(GroupMembership)
        private readonly membershipRepo: Repository<GroupMembership>,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.get<GroupRole[]>(
            GROUP_ROLES_KEY,
            context.getHandler(),
        );
        if (!requiredRoles || requiredRoles.length === 0) return true;

        const request = context.switchToHttp().getRequest();
        const userId = request.user?.id;
        const groupId = request.body.groupId || request.params.groupId || request.params.id;
        let group: Group | undefined;

        if (request.user?.role === 'admin') {
            request.user.groupRole = GroupRole.ADMIN;
            return true;
        }

        if (!userId || !groupId) {
            throw new ForbiddenException('User or group not found');
        }

        const groupResult = await this.groupRepo.findOne({ where: { id: groupId } });
        if (!groupResult) {
            throw new ForbiddenException('Group not found');
        }
        group = groupResult;

        // Si allCanManageEvents está activo, permitir acceso
        if (group.allCanManageEvents) {
            request.user.groupRole = GroupRole.ADMIN;
            return true;
        }

        // Si no, comprobar el rol del usuario en el grupo
        const membership = await this.membershipRepo.findOne({
            where: { user: { id: userId }, group: { id: groupId } },
        });
        if (!membership || !requiredRoles.includes(membership.role)) {
            throw new ForbiddenException('Insufficient permissions');
        }
        request.user.groupRole = membership.role;
        return true;
    }
}
