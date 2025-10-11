import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupMembership, GroupRole } from './entities/group-membership.entity';
import { GroupInvitation, InvitationStatus } from './entities/group-invitation.entity';
import { User } from '../users/entities/user.entity';
import { AddMemberDto } from './dto/add-member.dto';

type GroupWithOwner = Group & { owner: { id: string; name?: string } | null };

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupMembership)
    private readonly membershipRepository: Repository<GroupMembership>,
    @InjectRepository(GroupInvitation)
    private readonly groupInvitationRepository: Repository<GroupInvitation>,
  ) { }

  async createGroup(
    createGroupDto: CreateGroupDto,
    user: User & { role: string },
  ) {
    // Crear el grupo
    const group = this.groupRepository.create(createGroupDto);
    const savedGroup = await this.groupRepository.save(group);

    // Registrar al usuario como owner en GroupMembership
    const membership = this.membershipRepository.create({
      user: { id: user.id },
      group: { id: savedGroup.id },
      role: GroupRole.OWNER,
    });
    await this.membershipRepository.save(membership);

    return savedGroup;
  }

  async getGroups(withOwner?: boolean) {
    const groups = await this.groupRepository.find();
    if (!withOwner) return groups;

    const result: GroupWithOwner[] = [];
    for (const group of groups) {
      const ownerMembership = await this.membershipRepository.findOne({
        where: { group: { id: group.id }, role: GroupRole.OWNER },
        relations: ['user'],
      });
      result.push({
        ...group,
        owner: ownerMembership
          ? {
            id: ownerMembership.user.id,
            name: ownerMembership.user.name,
          }
          : null,
      });
    }
    return result;
  }

  async getGroup(id: string) {
    return await this.groupRepository.findOne({ where: { id } });
  }

  async updateGroup(id: string, updateGroupDto: UpdateGroupDto) {
    await this.groupRepository.update(id, updateGroupDto);
    return await this.groupRepository.findOne({ where: { id } });
  }

  async deleteGroup(id: string) {
    const group = await this.groupRepository.findOne({ where: { id } });
    if (!group) {
      throw new Error('Group not found');
    }
    // Eliminar primero las membresías asociadas
    await this.membershipRepository.delete({ group: { id } });
    // Ahora eliminar el grupo
    await this.groupRepository.remove(group);
    return { id };
  }

  /** Metodos de gestión de usuarios en grupos */
  async addMember(
    groupId: string,
    member: AddMemberDto,
  ) {
    const membership = this.membershipRepository.create({
      user: { id: member.userId },
      group: { id: groupId },
      role: member.role || GroupRole.MEMBER,
    });
    return await this.membershipRepository.save(membership);
  }

  async removeMember(groupId: string, userId: string) {
    const membership = await this.membershipRepository.findOne({
      where: { group: { id: groupId }, user: { id: userId } },
    });
    if (!membership) {
      throw new BadRequestException('Membership not found');
    }
    await this.membershipRepository.remove(membership);
    return { userId, groupId };
  }

  async listMembers(groupId: string) {
    const memberships = await this.membershipRepository.find({
      where: { group: { id: groupId } },
      relations: ['user'],
    });
    return memberships.map((m) => ({
      userId: m.user.id,
      userName: m.user.name,
      role: m.role,
    }));
  }

  async getUserRoleInGroup(userId: string, groupId: string): Promise<GroupRole | null> {
    const membership = await this.membershipRepository.findOne({
      where: { user: { id: userId }, group: { id: groupId } },
    });
    return membership ? membership.role : null;
  }

  async getGroupOwner(groupId: string) {
    const ownerMembership = await this.membershipRepository.findOne({
      where: { group: { id: groupId }, role: GroupRole.OWNER },
      relations: ['user'],
    });
    if (!ownerMembership) {
      throw new BadRequestException('Owner not found');
    }
    return {
      userId: ownerMembership.user.id,
      userName: ownerMembership.user.name,
    };
  }

  async changeGroupOwner(groupId: string, newOwnerId: string) {
    const currentOwnerMembership = await this.membershipRepository.findOne({
      where: { group: { id: groupId }, role: GroupRole.OWNER },
    });
    if (!currentOwnerMembership) {
      throw new BadRequestException('Current owner not found');
    }

    const newOwnerMembership = await this.membershipRepository.findOne({
      where: { group: { id: groupId }, user: { id: newOwnerId } },
    });
    if (!newOwnerMembership) {
      throw new BadRequestException('New owner must be a member of the group');
    }

    // Cambiar roles
    currentOwnerMembership.role = GroupRole.ADMIN;
    newOwnerMembership.role = GroupRole.OWNER;
    await this.membershipRepository.save([currentOwnerMembership, newOwnerMembership]);

    return {
      userId: newOwnerMembership.user.id,
      userName: newOwnerMembership.user.name,
    };
  }

  async isUserInGroup(userId: string, groupId: string): Promise<boolean> {
    const membership = await this.membershipRepository.findOne({
      where: { user: { id: userId }, group: { id: groupId } },
    });
    return !!membership;
  }

  async updateMemberRole(groupId: string, userId: string, newRole: GroupRole) {
    const membership = await this.membershipRepository.findOne({
      where: { group: { id: groupId }, user: { id: userId } },
    });
    if (!membership) {
      throw new BadRequestException('Membership not found');
    }
    membership.role = newRole;
    await this.membershipRepository.save(membership);
    return {
      userId: membership.user.id,
      groupId: membership.group.id,
      role: membership.role,
    };
  }

  /** Métodos de gestión de invitaciones */
  async createInvitation(
    groupId: string,
    invitedUserId: string | null,
    expiresAt: Date | null,
  ) {
    const invitation = this.groupInvitationRepository.create({
      group: { id: groupId },
      invitedUser: invitedUserId ? { id: invitedUserId } : null,
      status: 'pending' as InvitationStatus,
      expiresAt,
    });
    return await this.groupInvitationRepository.save(invitation);
  }

  /** 
   * Aceptar invitacion. 
   * El usuario de la invitacion puede ser nulo (invitacion abierta). 
   * Si es nulo, el usuario que acepta la invitacion es el que se añade al grupo. Para ello, se debe pasar el userId del usuario que acepta la invitacion.
   * */
  async acceptInvitation(invitationId: string, userId: string) {
    const invitation = await this.groupInvitationRepository.findOne({
      where: { id: invitationId },
      relations: ['group', 'invitedUser'],
    });
    if (!invitation) {
      throw new BadRequestException('Invitation not found');
    }
    if (invitation.status !== 'pending') {
      throw new BadRequestException('Invitation is not pending');
    }
    if (invitation.expiresAt && invitation.expiresAt < new Date()) {
      invitation.status = 'expired';
      await this.groupInvitationRepository.save(invitation);
      throw new BadRequestException('Invitation has expired');
    }
    // Si la invitacion tiene un usuario invitado, debe coincidir con el userId que acepta la invitacion
    if (invitation.invitedUser && invitation.invitedUser.id !== userId) {
      throw new BadRequestException('This invitation is not for you');
    }

    // Añadir al usuario al grupo
    const membership = this.membershipRepository.create({
      user: { id: userId },
      group: { id: invitation.group.id },
      role: GroupRole.MEMBER,
    });
    await this.membershipRepository.save(membership);

    // Actualizar estado de la invitacion
    invitation.status = 'accepted';
    await this.groupInvitationRepository.save(invitation);

    return invitation;
  }

  async declineInvitation(invitationId: string, userId: string) {
    const invitation = await this.groupInvitationRepository.findOne({
      where: { id: invitationId },
      relations: ['invitedUser'],
    });
    if (!invitation) {
      throw new BadRequestException('Invitation not found');
    }
    if (invitation.status !== 'pending') {
      throw new BadRequestException('Invitation is not pending');
    }
    // Si la invitacion tiene un usuario invitado, debe coincidir con el userId que acepta la invitacion
    if (invitation.invitedUser && invitation.invitedUser.id !== userId) {
      throw new BadRequestException('This invitation is not for you');
    }

    // Actualizar estado de la invitacion
    invitation.status = 'declined';
    await this.groupInvitationRepository.save(invitation);

    return invitation;
  }

  async listInvitations(groupId: string, status?: InvitationStatus) {
    const whereClause: any = { group: { id: groupId } };
    if (status) {
      whereClause.status = status;
    }
    return await this.groupInvitationRepository.find({
      where: whereClause,
      relations: ['invitedUser'],
    });
  }

}
