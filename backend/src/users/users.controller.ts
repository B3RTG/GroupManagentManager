import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
	async getMe(@Req() req: any) {
		// req.user viene del JWT
		return req.user;
	}

	@Get()
	@Roles('admin')
	@UseGuards(RolesGuard)
	async getUsers(
		@Query('page') page: number = 1,
		@Query('limit') limit: number = 10,
		@Query('search') search?: string,
	) {
		return this.usersService.findAll({ page, limit, search });
	}
}
