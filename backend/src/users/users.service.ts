import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll({
    page,
    limit,
    filters,
    selectFields,
    orderBy,
    orderDir,
  }: {
    page: number;
    limit: number;
    filters?: { search?: string; role?: string };
    selectFields?: string[];
    orderBy?: string;
    orderDir?: 'ASC' | 'DESC';
  }) {
    const where: any[] = [];
    if (filters?.search) {
      where.push({ email: Like(`%${filters.search}%`) });
      where.push({ username: Like(`%${filters.search}%`) });
      where.push({ name: Like(`%${filters.search}%`) });
    }
    if (filters?.role) {
      where.push({ role: filters.role });
    }

    // Selección de campos
    let select: Record<string, boolean> | undefined = undefined;
    if (selectFields && selectFields.length > 0) {
      select = {};
      selectFields.forEach((f) => {
        select![f] = true;
      });
    }

    // Ordenación
    const order: Record<string, 'ASC' | 'DESC'> = {};
    order[orderBy || 'name'] = orderDir || 'ASC';

    const [users, total] = await this.userRepository.findAndCount({
      where: where.length > 0 ? where : undefined,
      select,
      skip: (page - 1) * limit,
      take: limit,
      order,
    });

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      filters,
      orderBy,
      orderDir,
      fields: selectFields,
    };
  }
  async updateUser(id: string, updateData: Partial<User>) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    Object.assign(user, updateData);
    await this.userRepository.save(user);
    // Consultar el usuario actualizado y devolverlo completo
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    return updatedUser;
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    await this.userRepository.remove(user);
    return { id };
  }
}
