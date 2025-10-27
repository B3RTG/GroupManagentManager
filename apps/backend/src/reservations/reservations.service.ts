import { BadRequestException, Injectable } from '@nestjs/common';
import { Reservation } from './entities';
import { UnifiedReservation } from '../unified-reservations/entities/unified-reservation.entity';
import { Group } from '../groups/entities/group.entity';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReservationDto } from './dto';
import { Repository } from 'typeorm';


@Injectable()
export class ReservationsService {

    constructor(
        @InjectRepository(Reservation)
        private readonly reservationsRepository: Repository<Reservation>,
        @InjectRepository(UnifiedReservation)
        private readonly unifiedReservationRepository: Repository<UnifiedReservation>,
        @InjectRepository(Group)
        private readonly groupRepository: Repository<Group>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }


    async createReservation(dto: CreateReservationDto): Promise<Reservation> {

        // 1 - Validar que existe una reserva unificada con el ID proporcionado
        if (!dto.unifiedReservationId) {
            throw new BadRequestException('Debe proporcionar un ID de reserva unificada válido');
        }
        const unifiedReservation = await this.unifiedReservationRepository.findOne({ where: { id: dto.unifiedReservationId } });
        if (!unifiedReservation) {
            throw new BadRequestException('La reserva unificada especificada no existe');
        }

        // 2 - Validar que el grupo existe
        if (!dto.groupId || dto.groupId.length === 0) {
            throw new BadRequestException('Debe proporcionar un ID de grupo válido');
        }
        const group = await this.groupRepository.findOne({ where: { id: dto.groupId } });
        if (!group) {
            throw new BadRequestException('El grupo especificado no existe');
        }

        // 3 - Validar que el usuario creador existe
        if (!dto.createdBy || dto.createdBy.length === 0) {
            throw new BadRequestException('Debe proporcionar un ID de usuario creador válido');
        }
        const user = await this.userRepository.findOne({ where: { id: dto.createdBy } });
        if (!user) {
            throw new BadRequestException('El usuario creador especificado no existe');
        }

        const reservation = this.reservationsRepository.create({
            group,
            unifiedReservation,
            date: dto.date,
            // resourceId: dto.resourceId,
            slots: dto.slots,
            createdBy: user
        });
        return await this.reservationsRepository.save(reservation);
    }

    async findReservation(id: string): Promise<Reservation | null> {
        return await this.reservationsRepository.findOne({ where: { id } });
    }

    async updateReservation(id: string, dto: CreateReservationDto): Promise<Reservation | null> {
        const reservation = await this.findReservation(id);
        if (!reservation) {
            return null;
        }

        // Validar y asignar instancias completas
        const group = await this.groupRepository.findOne({ where: { id: dto.groupId } });
        if (!group) {
            throw new BadRequestException('El grupo especificado no existe');
        }
        const unifiedReservation = await this.unifiedReservationRepository.findOne({ where: { id: dto.unifiedReservationId } });
        if (!unifiedReservation) {
            throw new BadRequestException('La reserva unificada especificada no existe');
        }
        const user = await this.userRepository.findOne({ where: { id: dto.createdBy } });
        if (!user) {
            throw new BadRequestException('El usuario creador especificado no existe');
        }
        reservation.group = group;
        reservation.unifiedReservation = unifiedReservation;
        reservation.date = new Date(dto.date);
        reservation.slots = dto.slots;
        reservation.createdBy = user;

        return await this.reservationsRepository.save(reservation);
    }

    async deleteReservation(id: string): Promise<boolean> {

        const reservation = await this.findReservation(id);
        if (!reservation) {
            return false;
        }

        const result = await this.reservationsRepository.delete(id);
        return result.affected !== 0;
    }

    // Listar todas las reservas disponibles con filtros opcionales
    async listReservations(filter?: {
        unifiedReservationId?: string;
        groupId?: string;
        createdBy?: string;
        date?: string;
    }): Promise<Reservation[]> {
        const query = this.reservationsRepository.createQueryBuilder('reservation');

        if (filter) {
            if (filter.unifiedReservationId) {
                query.andWhere('reservation.unifiedReservationId = :unifiedReservationId', { unifiedReservationId: filter.unifiedReservationId });
            }
            if (filter.groupId) {
                query.andWhere('reservation.groupId = :groupId', { groupId: filter.groupId });
            }
            if (filter.createdBy) {
                query.andWhere('reservation.createdBy = :createdBy', { createdBy: filter.createdBy });
            }
            if (filter.date) {
                query.andWhere('reservation.date = :date', { date: filter.date });
            }
        }

        return await query.getMany();
    }


}
