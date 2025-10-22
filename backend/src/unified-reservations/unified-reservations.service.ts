import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateMatchDto, UpdateMatchDto } from '../matches/dto';
import { Match, MatchStatus } from '../matches/entities';
import { Reservation } from '../reservations/entities';
import { ReservationStatus } from '../reservations/entities/reservation.entity';
import { UnifiedReservationStatus, UnifiedReservation, Guest, Participant } from './entities';
import { ParticipantType } from './entities/participant.entity';
import { GuestType } from './entities/guest.entity';
import { plainToInstance } from 'class-transformer';
import { Group } from '../groups/entities/group.entity';
import { User } from '../users/entities/user.entity';

import { DisponibilityDto, CreateGuestDto, CreateReservationForUnifiedDto, CreateUnifiedReservationDto, UnifiedReservationReadDto, UpdateUnifiedReservationDto } from './dto';

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
        const memberships = await this.groupRepo.manager.getRepository('GroupMembership').find({
            where: { user: { id: userId } },
            relations: ['group'],
        });
        const groupIds = memberships.map((m: any) => m.group.id);
        if (groupIds.length === 0) return [];

        // Construir relaciones dinámicamente según los flags
        const relations: string[] = [];
        if (query.includeGroup) relations.push('group');
        if (query.includeMatches) relations.push('matches');
        if (query.includeReservations) relations.push('reservations');
        if (query.includeParticipantsAndGuests !== false) {
            relations.push('participants', 'guests');
        }

        return await this.unifiedReservationRepo.find({
            where: { group: { id: In(groupIds) } },
            relations,
            order: { date: 'DESC', time: 'DESC' },
        });
    }

    async create(dto: CreateUnifiedReservationDto) {
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

    async findOne(id: string, showDisponibility: boolean = false): Promise<UnifiedReservationReadDto | null> {
        // Cargar la reserva unificada con relaciones
        const unifiedReservation = await this.unifiedReservationRepo.findOne({
            where: { id },
            relations: [
                'group',
                'matches',
                'reservations',
                'participants',
                'guests',
            ],
        });
        if (!unifiedReservation) return null;

        // Calcular ocupación si se requiere

        let disponibility: DisponibilityDto | undefined = undefined;
        if (showDisponibility) {
            disponibility = await this.calculateFullDisponibility(id);
        }

        // Mapear a DTO
        const dto = plainToInstance(UnifiedReservationReadDto, {
            ...unifiedReservation,
            disponibility,
        });
        return dto;
    }

    update(id: string, dto: UpdateUnifiedReservationDto) {
        // TODO: Implementar lógica para actualizar una reserva unificada
        return {};
    }

    remove(id: string) {
        // TODO: Implementar lógica para eliminar una reserva unificada
        return {};
    }

    async addReservation(unifiedReservationId: string, dto: CreateReservationForUnifiedDto) {
        // Validar que la reserva unificada existe y está activa
        const unifiedReservation = await this.unifiedReservationRepo.findOne({
            where: { id: unifiedReservationId },
            relations: ['group'],
        });
        if (!unifiedReservation) {
            throw new BadRequestException('Reserva unificada no encontrada');
        }
        if (unifiedReservation.status !== UnifiedReservationStatus.ACTIVE) {
            throw new BadRequestException('No se pueden añadir reservas a una reserva unificada no activa');
        }

        // revisar que la fecha de la reserva individual coincide con la de la reserva unificada
        if (new Date(dto.date).toDateString() !== unifiedReservation.date.toDateString()) {
            throw new BadRequestException('La fecha de la reserva individual debe coincidir con la de la reserva unificada');
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
            // resourceId: dto.resourceId,
            createdBy: user,
            slots: dto.slots,
            status: ReservationStatus.CONFIRMED,
        });
        await this.reservationRepo.save(reservation);
        return reservation;
    }

    listReservations(unifiedReservationId: string) {
        return this.reservationRepo.find({
            where: { unifiedReservation: { id: unifiedReservationId } },
            relations: ['group', 'createdBy'],
        });
    }

    async createMatch(unifiedReservationId: string, dto: CreateMatchDto) {
        // TODO: Implementar lógica para crear un partido
        return {};
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

    // Participantes e invitados
    async listParticipantsAndGuests(unifiedReservationId: string) {
        const participants = await this.unifiedReservationRepo.manager.getRepository(Participant).find({
            where: { unifiedReservation: { id: unifiedReservationId } },
            relations: ['user'],
        });
        const guests = await this.unifiedReservationRepo.manager.getRepository(Guest).find({
            where: { unifiedReservation: { id: unifiedReservationId } },
        });
        return { participants, guests };
    }

    /**
    * Añade un participante (usuario) a una reserva unificada
    */
    async addParticipant(unifiedReservationId: string, userId: string, type: ParticipantType = ParticipantType.PRINCIPAL) {

        // 1 - Buscar la reserva unificada
        const unifiedReservation = await this.unifiedReservationRepo.findOne({ where: { id: unifiedReservationId } });
        if (!unifiedReservation) throw new Error('Reserva unificada no encontrada');

        // 2 - Buscar el usuario
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new Error('Usuario no encontrado');

        // Si ya existe como participante, no añadir de nuevo
        const existingParticipant = await this.unifiedReservationRepo.manager.getRepository(Participant).findOne({
            where: { unifiedReservation: { id: unifiedReservationId }, user: { id: userId } },
        });
        if (existingParticipant) {
            return existingParticipant;
        }

        // Si se quiere añadir como participante PRINCIPAL, comprobar que no excede el límite de plazas
        if (type === ParticipantType.PRINCIPAL) {
            const disponibility = await this.calculateFullDisponibility(unifiedReservationId);
            if (disponibility.availableSlots <= 0) {
                throw new BadRequestException('No hay plazas disponibles para añadir más participantes principales');
            }
        }

        // 3 - Crear el participante
        const participant = new Participant();
        participant.unifiedReservation = unifiedReservation;
        participant.user = user;
        participant.type = type;
        return await this.unifiedReservationRepo.manager.getRepository(Participant).save(participant);
    }

    /**
     * Añade un invitado a una reserva unificada
     */
    async addGuest(unifiedReservationId: string, dto: CreateGuestDto) {
        // 1 - Buscar la reserva unificada
        const unifiedReservation = await this.unifiedReservationRepo.findOne({ where: { id: unifiedReservationId } });
        if (!unifiedReservation) throw new Error('Reserva unificada no encontrada');

        // Si se quiere añadir como invitado PRINCIPAL, comprobar que no excede el límite de plazas
        if ((dto.type ?? GuestType.PRINCIPAL) === GuestType.PRINCIPAL) {
            const disponibility = await this.calculateFullDisponibility(unifiedReservationId);
            if (disponibility.availableSlots <= 0) {
                throw new BadRequestException('No hay plazas disponibles para añadir más invitados principales');
            }
        }

        // 2 - Crear el invitado (con usuario creador obligatorio)
        if (!dto.createdBy) throw new Error('Debe especificar el usuario creador');
        const createdByUser = await this.userRepo.findOne({ where: { id: dto.createdBy } });
        if (!createdByUser) throw new Error('Usuario creador no encontrado');

        const guest = new Guest();
        guest.unifiedReservation = unifiedReservation;
        guest.name = dto.name;
        guest.email = dto.email;
        guest.type = dto.type ?? GuestType.PRINCIPAL;
        guest.createdBy = createdByUser;
        return await this.unifiedReservationRepo.manager.getRepository(Guest).save(guest);
    }

    /**
     * Elimina un participante de una reserva unificada.
     * Si el participante es de tipo PRINCIPAL, se libera una plaza.
     */
    async removeParticipant(unifiedReservationId: string, userId: string): Promise<boolean> {
        // 1 - Buscar la reserva unificada
        const unifiedReservation = await this.unifiedReservationRepo.findOne({ where: { id: unifiedReservationId } });
        if (!unifiedReservation) throw new Error('Reserva unificada no encontrada');

        // 2 - Buscar el participante
        const participant = await this.unifiedReservationRepo.manager.getRepository(Participant).findOne({
            where: { unifiedReservation: { id: unifiedReservationId }, user: { id: userId } },
        });
        if (!participant) throw new Error('Participante no encontrado');

        // 3 - Si es de tipo PRINCIPAL, liberar una plaza
        if (participant.type === ParticipantType.PRINCIPAL) {
            const disponibility = await this.calculateFullDisponibility(unifiedReservationId);
            if (disponibility.availableSlots < 0) {
                throw new BadRequestException('No se puede eliminar el participante principal');
            }
        }

        // 4 - Eliminar el participante
        await this.unifiedReservationRepo.manager.getRepository(Participant).remove(participant);

        return true;
    }

    /**
     * Elimina un invitado de una reserva unificada.
     */
    async removeGuest(unifiedReservationId: string, guestId: string): Promise<boolean> {
        // 1 - Buscar la reserva unificada
        const unifiedReservation = await this.unifiedReservationRepo.findOne({ where: { id: unifiedReservationId } });
        if (!unifiedReservation) throw new Error('Reserva unificada no encontrada');

        // 2 - Buscar el invitado
        const guest = await this.unifiedReservationRepo.manager.getRepository(Guest).findOne({
            where: { unifiedReservation: { id: unifiedReservationId }, id: guestId },
        });
        if (!guest) throw new Error('Invitado no encontrado');

        // 3 - Eliminar el invitado
        await this.unifiedReservationRepo.manager.getRepository(Guest).remove(guest);

        return true;
    }

    /**
     * Disponibilidad total de plazas de una reserva unificada
     */
    async calculateTotalSlots(unifiedReservationId: string): Promise<number> {
        // 0 - Obtener la reserva unificada
        const unifiedReservation = await this.unifiedReservationRepo.findOne({ where: { id: unifiedReservationId } });
        if (!unifiedReservation) {
            throw new BadRequestException('Reserva unificada no encontrada');
        }
        // 1 - Obtener todas las reservas individuales asociadas a la reserva unificada
        const reservations = await this.reservationRepo.find({ where: { unifiedReservation: { id: unifiedReservationId } } });

        // 2 - Sumar el número de plazas de cada reserva individual
        const totalSlots = reservations.reduce((sum, reservation) => sum + reservation.slots, 0);
        return totalSlots;
    }

    async calculateFullDisponibility(unifiedReservationId: string): Promise<DisponibilityDto> {
        // 0 - Obtener la reserva unificada
        const unifiedReservation = await this.unifiedReservationRepo.findOne({ where: { id: unifiedReservationId } });
        if (!unifiedReservation) {
            throw new BadRequestException('Reserva unificada no encontrada');
        }
        // 1 - Obtener el numero total de plazas del evento
        const totalSlots = await this.calculateTotalSlots(unifiedReservationId);

        // 2 - Calcular las plazas ocupadas y disponibles mirando participantes e invitados de la reserva unificada
        // 2.1 - Contar participantes con ParticipantType PRINCIPAL
        const participantsCount = await this.unifiedReservationRepo.manager.getRepository(Participant).count({
            where: { unifiedReservation: { id: unifiedReservationId }, type: ParticipantType.PRINCIPAL },
        });

        // 2.2 - Contar invitados con GuestType PRINCIPAL
        const guestsCount = await this.unifiedReservationRepo.manager.getRepository(Guest).count({
            where: { unifiedReservation: { id: unifiedReservationId }, type: GuestType.PRINCIPAL },
        });

        // 2.3 - Contar sustitutos (invitados de tipo SUBSTITUTE y participantes de tipo SUBSTITUTE)
        const substitutesCount = await this.unifiedReservationRepo.manager.getRepository(Guest).count({
            where: { unifiedReservation: { id: unifiedReservationId }, type: GuestType.SUBSTITUTE },
        });
        const participantsSubstitutesCount = await this.unifiedReservationRepo.manager.getRepository(Participant).count({
            where: { unifiedReservation: { id: unifiedReservationId }, type: ParticipantType.SUBSTITUTE },
        });

        // 3 - Calcular plazas disponibles
        const occupiedSlots = participantsCount + guestsCount;
        const availableSlots = totalSlots - occupiedSlots;
        const totalSubstitutes = substitutesCount + participantsSubstitutesCount;

        return { totalSlots, availableSlots, currentOccupancy: occupiedSlots, substitutes: totalSubstitutes };
    }
}
