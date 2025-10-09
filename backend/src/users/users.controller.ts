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
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('me')
  @UseGuards(AuthGuard('jwt'))
  async updateMe(
    @Req() req: { user: User },
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    body: UpdateUserDto,
  ) {
    try {
      const userId = req.user.id;
      const user = await this.usersService.updateUser(userId, body);
      return user;
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
      const user = await this.usersService.updateUser(id, body);
      return user;
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
    return this.usersService.findAll({
      page: query.page,
      limit: query.limit,
      filters,
      selectFields,
      orderBy: query.orderBy,
      orderDir: query.orderDir,
    });
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMe(@Req() req: { user: any }): any {
    // req.user viene del JWT
    return req.user;
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
