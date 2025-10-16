
import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UnifiedReservationsService } from './unified-reservations.service';
import { CreateUnifiedReservationDto } from './dto/create-unified-reservation.dto';
import { UpdateUnifiedReservationDto } from './dto/update-unified-reservation.dto';
import { CreateReservationDto } from '../reservations/dto/create-reservation.dto';
import { CreateMatchDto } from '../matches/dto/create-match.dto';
import { UpdateMatchDto } from '../matches/dto/update-match.dto';
import { UnifiedReservationRoleGuard } from './guards/unified-reservation-role.guard';
import { GroupRoles } from './decorators/group-roles.decorator';
import { GroupRole } from '../groups/entities/group-membership.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('unified-reservations')
export class UnifiedReservationsController {
    constructor(private readonly service: UnifiedReservationsService) { }

    @Get()
    findAll(@Query() query: any, @Req() req: any) {
        // req.user.id es el usuario autenticado, lo carga el AuthGuard
        return this.service.findAllForUser(req.user.id, query);
    }


    @Post()
    @UseGuards(UnifiedReservationRoleGuard)
    @GroupRoles(GroupRole.OWNER, GroupRole.ADMIN)
    create(@Body() dto: CreateUnifiedReservationDto) {
        return this.service.create(dto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateUnifiedReservationDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }

    // Reservas individuales

    @Post(':id/reservations')
    @UseGuards(UnifiedReservationRoleGuard)
    @GroupRoles(GroupRole.OWNER, GroupRole.ADMIN)
    addReservation(@Param('id') id: string, @Body() dto: CreateReservationDto) {
        return this.service.addReservation(id, dto);
    }

    @Get(':id/reservations')
    listReservations(@Param('id') id: string) {
        return this.service.listReservations(id);
    }

    // Partidos

    @Post(':id/matches')
    @UseGuards(UnifiedReservationRoleGuard)
    @GroupRoles(GroupRole.OWNER, GroupRole.ADMIN)
    createMatch(@Param('id') id: string, @Body() dto: CreateMatchDto) {
        return this.service.createMatch(id, dto);
    }

    @Get(':id/matches')
    listMatches(@Param('id') id: string) {
        return this.service.listMatches(id);
    }

    @Get(':id/matches/:matchId')
    findMatch(@Param('id') id: string, @Param('matchId') matchId: string) {
        return this.service.findMatch(id, matchId);
    }

    @Put(':id/matches/:matchId')
    updateMatch(@Param('id') id: string, @Param('matchId') matchId: string, @Body() dto: UpdateMatchDto) {
        return this.service.updateMatch(id, matchId, dto);
    }

    @Delete(':id/matches/:matchId')
    removeMatch(@Param('id') id: string, @Param('matchId') matchId: string) {
        return this.service.removeMatch(id, matchId);
    }
}
