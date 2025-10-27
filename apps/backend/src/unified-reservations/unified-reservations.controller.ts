
import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
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

@ApiTags('unified-reservations')
@ApiBearerAuth()
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
    @ApiOperation({ summary: 'Listar reservas unificadas del usuario autenticado' })
    @ApiQuery({ name: 'includeGroup', required: false, type: String })
    @ApiQuery({ name: 'includeMatches', required: false, type: String })
    @ApiQuery({ name: 'includeReservations', required: false, type: String })
    @ApiQuery({ name: 'includeParticipantsAndGuests', required: false, type: String })
    @ApiResponse({ status: 200, description: 'Lista de reservas unificadas.' })
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
    @ApiOperation({ summary: 'Crear una reserva unificada' })
    @ApiBody({ type: CreateUnifiedReservationDto })
    @ApiResponse({ status: 201, description: 'Reserva unificada creada.' })
    @UseGuards(UnifiedReservationRoleGuard)
    @GroupRoles(GroupRole.OWNER, GroupRole.ADMIN)
    create(@Body() dto: CreateUnifiedReservationDto) {
        return this.service.create(dto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener una reserva unificada por ID' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'Reserva unificada encontrada.' })
    findOne(@Param('id') id: string) {
        return this.service.findOne(id, false);
    }

    @Get(':id/details')
    @ApiOperation({ summary: 'Obtener detalles completos de una reserva unificada' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'Detalles completos de la reserva unificada.' })
    findDetails(@Param('id') id: string) {
        return this.service.findOne(id, true);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar una reserva unificada' })
    @ApiParam({ name: 'id', type: String })
    @ApiBody({ type: UpdateUnifiedReservationDto })
    @ApiResponse({ status: 200, description: 'Reserva unificada actualizada.' })
    update(@Param('id') id: string, @Body() dto: UpdateUnifiedReservationDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar una reserva unificada' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'Reserva unificada eliminada.' })
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }

    // Participantes e invitados

    @Post(':id/participants')
    @ApiOperation({ summary: 'Añadir participante a la reserva unificada' })
    @ApiParam({ name: 'id', type: String })
    @ApiBody({ schema: { properties: { userId: { type: 'string' }, type: { type: 'string', enum: Object.values(ParticipantType) } } } })
    @ApiResponse({ status: 201, description: 'Participante añadido.' })
    addParticipant(
        @Param('id') id: string,
        @Body() dto: { userId: string; type?: ParticipantType }
    ) {
        return this.service.addParticipant(id, dto.userId, dto.type ?? ParticipantType.PRINCIPAL);
    }

    @Delete(':id/participants/:participantId')
    @ApiOperation({ summary: 'Eliminar participante de la reserva unificada' })
    @ApiParam({ name: 'id', type: String })
    @ApiParam({ name: 'participantId', type: String })
    @ApiResponse({ status: 200, description: 'Participante eliminado.' })
    removeParticipant(@Param('id') id: string, @Param('participantId') participantId: string) {
        return this.service.removeParticipant(id, participantId);
    }

    @Post(':id/guests')
    @ApiOperation({ summary: 'Añadir invitado a la reserva unificada' })
    @ApiParam({ name: 'id', type: String })
    @ApiBody({ type: CreateGuestDto })
    @ApiResponse({ status: 201, description: 'Invitado añadido.' })
    addGuest(@Param('id') id: string, @Body() dto: CreateGuestDto, @Req() req: any) {
        if (!dto.createdBy) {
            dto.createdBy = req.user.id;
        }
        return this.service.addGuest(id, dto);
    }

    @Delete(':id/guests/:guestId')
    @ApiOperation({ summary: 'Eliminar invitado de la reserva unificada' })
    @ApiParam({ name: 'id', type: String })
    @ApiParam({ name: 'guestId', type: String })
    @ApiResponse({ status: 200, description: 'Invitado eliminado.' })
    removeGuest(@Param('id') id: string, @Param('guestId') guestId: string) {
        return this.service.removeGuest(id, guestId);
    }

    @Get(':id/participants-and-guests')
    @ApiOperation({ summary: 'Listar participantes e invitados de la reserva unificada' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'Lista de participantes e invitados.' })
    listParticipantsAndGuests(@Param('id') id: string) {
        return this.service.listParticipantsAndGuests(id);
    }


    // Reservas individuales

    @Post(':id/reservations')
    @ApiOperation({ summary: 'Añadir reserva individual a la reserva unificada' })
    @ApiParam({ name: 'id', type: String })
    @ApiBody({ type: CreateReservationForUnifiedDto })
    @ApiResponse({ status: 201, description: 'Reserva individual añadida.' })
    @UseGuards(UnifiedReservationRoleGuard)
    @GroupRoles(GroupRole.OWNER, GroupRole.ADMIN)
    addReservation(@Param('id') id: string, @Body() dto: CreateReservationForUnifiedDto) {
        return this.service.addReservation(id, dto);
    }

    @Get(':id/reservations')
    @ApiOperation({ summary: 'Listar reservas individuales de la reserva unificada' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'Lista de reservas individuales.' })
    listReservations(@Param('id') id: string) {
        return this.service.listReservations(id);
    }

    // Partidos

    @Post(':id/matches')
    @ApiOperation({ summary: 'Crear partido en la reserva unificada' })
    @ApiParam({ name: 'id', type: String })
    @ApiBody({ type: CreateMatchDto })
    @ApiResponse({ status: 201, description: 'Partido creado.' })
    @UseGuards(UnifiedReservationRoleGuard)
    @GroupRoles(GroupRole.OWNER, GroupRole.ADMIN)
    createMatch(@Param('id') id: string, @Body() dto: CreateMatchDto) {
        return this.service.createMatch(id, dto);
    }

    @Get(':id/matches')
    @ApiOperation({ summary: 'Listar partidos de la reserva unificada' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'Lista de partidos.' })
    listMatches(@Param('id') id: string) {
        return this.service.listMatches(id);
    }

    @Get(':id/matches/:matchId')
    @ApiOperation({ summary: 'Obtener partido por ID en la reserva unificada' })
    @ApiParam({ name: 'id', type: String })
    @ApiParam({ name: 'matchId', type: String })
    @ApiResponse({ status: 200, description: 'Partido encontrado.' })
    findMatch(@Param('id') id: string, @Param('matchId') matchId: string) {
        return this.service.findMatch(id, matchId);
    }

    @Put(':id/matches/:matchId')
    @ApiOperation({ summary: 'Actualizar partido en la reserva unificada' })
    @ApiParam({ name: 'id', type: String })
    @ApiParam({ name: 'matchId', type: String })
    @ApiBody({ type: UpdateMatchDto })
    @ApiResponse({ status: 200, description: 'Partido actualizado.' })
    updateMatch(@Param('id') id: string, @Param('matchId') matchId: string, @Body() dto: UpdateMatchDto) {
        return this.service.updateMatch(id, matchId, dto);
    }

    @Delete(':id/matches/:matchId')
    @ApiOperation({ summary: 'Eliminar partido de la reserva unificada' })
    @ApiParam({ name: 'id', type: String })
    @ApiParam({ name: 'matchId', type: String })
    @ApiResponse({ status: 200, description: 'Partido eliminado.' })
    removeMatch(@Param('id') id: string, @Param('matchId') matchId: string) {
        return this.service.removeMatch(id, matchId);
    }
}
