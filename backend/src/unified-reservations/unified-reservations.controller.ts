
import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ParticipantType } from './entities/participant.entity';
import { GuestType } from './entities/guest.entity';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UnifiedReservationsQueryDto } from './dto/unified-reservations-query.dto';
import { AuthGuard } from '@nestjs/passport';
import { UnifiedReservationsService } from './unified-reservations.service';
import { CreateUnifiedReservationDto } from './dto/create-unified-reservation.dto';
import { UpdateUnifiedReservationDto } from './dto/update-unified-reservation.dto';
import { CreateReservationForUnifiedDto } from './dto/create-reservation-for-unified.dto';
import { CreateMatchDto } from '../matches/dto/create-match.dto';
import { UpdateMatchDto } from '../matches/dto/update-match.dto';
import { UnifiedReservationRoleGuard } from './guards/unified-reservation-role.guard';
import { GroupRoles } from './decorators/group-roles.decorator';
import { GroupRole } from '../groups/entities/group-membership.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('unified-reservations')
export class UnifiedReservationsController {
    constructor(private readonly service: UnifiedReservationsService) { }

    /**
     * GET /unified-reservations?includeGroup=true&includeMatches=true&includeReservations=true
     * Puedes pasar los flags como query params para incluir relaciones opcionales.
     * Ejemplo: /unified-reservations?includeGroup=true&includeMatches=true
     */
    @Get()
    findAll(@Query() query: UnifiedReservationsQueryDto, @Req() req: any) {
        // Normalizar los flags a booleanos, por defecto participantes/invitados true
        const normalizedQuery = {
            includeGroup: query.includeGroup === 'true',
            includeMatches: query.includeMatches === 'true',
            includeReservations: query.includeReservations === 'true',
            includeParticipantsAndGuests: query.includeParticipantsAndGuests !== 'false',
        };
        return this.service.findAllForUser(req.user.id, normalizedQuery);
    }


    @Post()
    @UseGuards(UnifiedReservationRoleGuard)
    @GroupRoles(GroupRole.OWNER, GroupRole.ADMIN)
    create(@Body() dto: CreateUnifiedReservationDto) {
        return this.service.create(dto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(id, false);
    }

    @Get(':id/details')
    findDetails(@Param('id') id: string) {
        return this.service.findOne(id, true);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateUnifiedReservationDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }

    // Participantes e invitados

    @Post(':id/participants')
    addParticipant(
        @Param('id') id: string,
        @Body() dto: { userId: string; type?: ParticipantType }
    ) {
        return this.service.addParticipant(id, dto.userId, dto.type ?? ParticipantType.PRINCIPAL);
    }

    @Delete(':id/participants/:participantId')
    removeParticipant(@Param('id') id: string, @Param('participantId') participantId: string) {
        return this.service.removeParticipant(id, participantId);
    }

    @Post(':id/guests')
    addGuest(@Param('id') id: string, @Body() dto: CreateGuestDto, @Req() req: any) {
        if (!dto.createdBy) {
            dto.createdBy = req.user.id;
        }
        return this.service.addGuest(id, dto);
    }

    @Delete(':id/guests/:guestId')
    removeGuest(@Param('id') id: string, @Param('guestId') guestId: string) {
        return this.service.removeGuest(id, guestId);
    }

    @Get(':id/participants-and-guests')
    listParticipantsAndGuests(@Param('id') id: string) {
        return this.service.listParticipantsAndGuests(id);
    }


    // Reservas individuales

    @Post(':id/reservations')
    @UseGuards(UnifiedReservationRoleGuard)
    @GroupRoles(GroupRole.OWNER, GroupRole.ADMIN)
    addReservation(@Param('id') id: string, @Body() dto: CreateReservationForUnifiedDto) {
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
