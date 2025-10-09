import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupMembership, GroupRole } from './entities/group-membership.entity';
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
      throw new Error('Membership not found');
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

}
