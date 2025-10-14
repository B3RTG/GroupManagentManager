import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
  ValidationPipe,
  Put,
  Param,
  Body,
  Delete,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Put('me')
  @UseGuards(AuthGuard('jwt'))
  async updateMe(
    @Req() req: { user: User },
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    body: UpdateUserDto,
  ) {
    try {
      const userId = req.user.id;
      const updateData: Partial<User> = {
        name: body.name,
        username: body.username,
        email: body.email,
        preferredSports: body.preferredSports,
        avatarUrl: body.avatarUrl,
        phoneNumber: body.phoneNumber,
        isActive: body.isActive,
        lastLogin: body.lastLogin ? new Date(body.lastLogin) : undefined,
      };
      const user = await this.usersService.updateUser(userId, updateData);
      return plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'Unknown error' };
    }
  }

  @Put(':id')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async updateUser(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    body: UpdateUserDto,
  ) {
    try {
      const updateData: Partial<User> = {
        name: body.name,
        username: body.username,
        email: body.email,
        preferredSports: body.preferredSports,
        avatarUrl: body.avatarUrl,
        phoneNumber: body.phoneNumber,
        isActive: body.isActive,
        lastLogin: body.lastLogin ? new Date(body.lastLogin) : undefined,
      };
      const user = await this.usersService.updateUser(id, updateData);
      return plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'Unknown error' };
    }
  }

  @Get()
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getUsers(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: GetUsersDto,
  ) {
    const selectFields = query.fields
      ? query.fields.split(',').map((f) => f.trim())
      : undefined;
    const filters = { search: query.search, role: query.role };
    const result = await this.usersService.findAll({
      page: query.page,
      limit: query.limit,
      filters,
      selectFields,
      orderBy: query.orderBy,
      orderDir: query.orderDir,
    });
    return {
      ...result,
      data: result.data.map((user: any) => plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true }))
    };
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMe(@Req() req: { user: any }): any {
    // req.user viene del JWT
    return plainToInstance(UserResponseDto, req.user, { excludeExtraneousValues: true });
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async deleteUser(@Param('id') id: string) {
    try {
      const deleted = await this.usersService.deleteUser(id);
      return { success: true, deleted };
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'Unknown error' };
    }
  }
}
