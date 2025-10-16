import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateUnifiedReservationDto, UpdateUnifiedReservationDto } from './dto';
import { CreateReservationDto } from '../reservations/dto/create-reservation.dto';
import { CreateMatchDto, UpdateMatchDto } from '../matches/dto';
import { Reservation, UnifiedReservation, Match, MatchStatus } from '../reservations/entities';
import { ReservationStatus } from '../reservations/entities/reservation.entity';
import { UnifiedReservationStatus } from './entities/unified-reservation.entity';
import { Group } from '../groups/entities/group.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class UnifiedReservationsService {
    constructor(
        @InjectRepository(UnifiedReservation)
        private readonly unifiedReservationRepo: Repository<UnifiedReservation>,
        @InjectRepository(Reservation)
        private readonly reservationRepo: Repository<Reservation>,
        @InjectRepository(Group)
        private readonly groupRepo: Repository<Group>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Match)
        private readonly matchRepo: Repository<Match>,
    ) { }
    async findAllForUser(userId: string, query: any) {
        // Buscar los grupos donde el usuario es miembro
        // Buscar los grupos donde el usuario es miembro
        const memberships = await this.groupRepo.manager.getRepository('GroupMembership').find({
            where: { user: { id: userId } },
            relations: ['group'],
        });
        const groupIds = memberships.map((m: any) => m.group.id);
        if (groupIds.length === 0) return [];
        // Buscar reservas unificadas de esos grupos
        return await this.unifiedReservationRepo.find({
            where: { group: { id: In(groupIds) } },
            relations: ['group', 'matches'],
            order: { date: 'DESC', time: 'DESC' },
        });
    }

    async create(dto: CreateUnifiedReservationDto) {
        // Validar que no exista ya una reserva unificada para el mismo grupo, fecha y hora
        const exists = await this.unifiedReservationRepo.findOne({
            where: {
                group: { id: dto.groupId },
                date: new Date(dto.date),
                time: dto.time,
            },
            relations: ['group'],
        });
        if (exists) {
            throw new Error('Ya existe una reserva unificada para este grupo, fecha y hora');
        }

        // Buscar el grupo
        const group = await this.groupRepo.findOne({ where: { id: dto.groupId } });
        if (!group) {
            throw new Error('Grupo no encontrado');
        }

        // Crear la reserva unificada
        const unifiedReservation = this.unifiedReservationRepo.create({
            group: group,
            date: new Date(dto.date),
            time: dto.time,
            status: UnifiedReservationStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        await this.unifiedReservationRepo.save(unifiedReservation);
        return unifiedReservation;
    }

    findOne(id: string) {
        // TODO: Implementar lógica para consultar una reserva unificada
        return {};
    }

    update(id: string, dto: UpdateUnifiedReservationDto) {
        // TODO: Implementar lógica para actualizar una reserva unificada
        return {};
    }

    remove(id: string) {
        // TODO: Implementar lógica para eliminar una reserva unificada
        return {};
    }

    async addReservation(unifiedReservationId: string, dto: CreateReservationDto) {
        // Validar que la reserva unificada existe y está activa
        const unifiedReservation = await this.unifiedReservationRepo.findOne({
            where: { id: unifiedReservationId },
            relations: ['group'],
        });
        if (!unifiedReservation) {
            throw new Error('Reserva unificada no encontrada');
        }
        if (unifiedReservation.status !== UnifiedReservationStatus.ACTIVE) {
            throw new Error('No se pueden añadir reservas a una reserva unificada no activa');
        }

        // Cargar el usuario real
        const user = await this.userRepo.findOne({ where: { id: dto.createdBy } });
        if (!user) {
            throw new Error('Usuario creador no encontrado');
        }

        // Crear la reserva individual asociada
        const reservation = this.reservationRepo.create({
            unifiedReservation: unifiedReservation,
            group: unifiedReservation.group,
            date: new Date(dto.date),
            resourceId: dto.resourceId,
            createdBy: user,
            slots: dto.slots,
            status: ReservationStatus.CONFIRMED,
        });
        await this.reservationRepo.save(reservation);
        return reservation;
    }

    listReservations(unifiedReservationId: string) {
        // TODO: Implementar lógica para listar reservas individuales
        return [];
    }

    async createMatch(unifiedReservationId: string, dto: CreateMatchDto) {
        // Validar que la reserva unificada existe y está activa
        const unifiedReservation = await this.unifiedReservationRepo.findOne({
            where: { id: unifiedReservationId },
            relations: ['group', 'matches'],
        });
        if (!unifiedReservation) {
            throw new Error('Reserva unificada no encontrada');
        }
        if (unifiedReservation.status !== UnifiedReservationStatus.ACTIVE) {
            throw new Error('No se pueden añadir partidos a una reserva unificada no activa');
        }

        // Cargar el usuario creador
        const user = await this.userRepo.findOne({ where: { id: dto.createdBy } });
        if (!user) {
            throw new Error('Usuario creador no encontrado');
        }

        // Validar que el total de participantes de todos los partidos no supere el total de plazas
        // (esto requiere implementar calculateTotalSlots y sumar los maxParticipants de los partidos existentes)
        // Suponemos que calculateTotalSlots está implementado correctamente
        const totalSlots = await this.calculateTotalSlots(unifiedReservationId);
        const currentParticipants = (unifiedReservation.matches || []).reduce((sum, m: any) => sum + (m.maxParticipants || 0), 0);
        if (currentParticipants + dto.maxParticipants > totalSlots) {
            throw new Error('El total de participantes de los partidos supera el total de plazas disponibles');
        }

        // Crear el partido asociado
        const match = new Match();
        match.unifiedReservation = unifiedReservation;
        match.group = unifiedReservation.group;
        match.sport = dto.sport;
        match.date = new Date(dto.date);
        match.time = dto.time;
        match.status = MatchStatus.SCHEDULED;
        match.maxParticipants = dto.maxParticipants;
        match.maxSubstitutes = dto.maxSubstitutes;
        match.createdBy = user;
        match.createdAt = new Date();
        match.updatedAt = new Date();

        // Guardar el partido
        await this.matchRepo.save(match);
        return match;
    }

    listMatches(unifiedReservationId: string) {
        // TODO: Implementar lógica para listar partidos
        return [];
    }

    findMatch(unifiedReservationId: string, matchId: string) {
        // TODO: Implementar lógica para consultar un partido
        return {};
    }

    updateMatch(unifiedReservationId: string, matchId: string, dto: UpdateMatchDto) {
        // TODO: Implementar lógica para actualizar un partido
        return {};
    }

    removeMatch(unifiedReservationId: string, matchId: string) {
        // TODO: Implementar lógica para eliminar un partido
        return {};
    }

    calculateTotalSlots(unifiedReservationId: string): Promise<number> {
        // TODO: Implementar lógica para calcular el total de plazas
        return Promise.resolve(0);
    }
}
