import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation, UnifiedReservation, Match, Guest } from './entities';
import { CreateReservationDto } from './dto';

@Injectable()
export class ReservationsService {

    constructor(
        @InjectRepository(Reservation)
        private readonly reservationRepository: Repository<Reservation>,
        @InjectRepository(UnifiedReservation)
        private readonly unifiedReservationRepository: Repository<UnifiedReservation>,
    ) { }


    async createReservation(reservation: CreateReservationDto) {

        // Dado que unifiedReservationId es opcional, si no se proporciona, crear una nueva reserva unificada
        if (!reservation.unifiedReservationId) {
            const newUnifiedReservation = this.unifiedReservationRepository.create();
            const savedUnifiedReservation = await this.unifiedReservationRepository.save(newUnifiedReservation);
            reservation.unifiedReservationId = savedUnifiedReservation.id;
        }

        // si se proporciona unifiedReservationId, verificar que exista, sino, lanzar error
        const unifiedReservation = await this.unifiedReservationRepository.findOne({ where: { id: reservation.unifiedReservationId } });
        if (!unifiedReservation) {
            throw new BadRequestException('Unified reservation not found');
        }

        // Verificar que la fecha no esté en el pasado
        const now = new Date();
        if (reservation.date < now) {
            throw new BadRequestException('Reservation date cannot be in the past');
        }

        // Verificar que no exista ya una reserva para la misma fecha y pista
        // primero ver si viene court en el dto, si no viene, asignar 1
        if (!reservation.court) {
            reservation.court = 1;
        }

        const existingReservation = await this.reservationRepository.findOne({ where: { date: reservation.date, courts: reservation.court } });
        if (existingReservation) {
            throw new BadRequestException('There is already a reservation for this date and court');
        }

        // Si llega hasta aquí, es que todo está bien
        // Crear la reserva
        const newReservation = this.reservationRepository.create({
            ...reservation,
            unifiedReservation: { id: reservation.unifiedReservationId },
            group: { id: reservation.groupId },
            creator: { id: reservation.creatorId },
        });
        return this.reservationRepository.save(newReservation);
    }

    async getReservationById(id: string) {
        return this.reservationRepository.findOne({ where: { id } });
    }

    async getAllReservations() {
        return this.reservationRepository.find();
    }

    async cancelReservation(id: string) {
        const reservation = await this.getReservationById(id);
        if (!reservation) {
            throw new BadRequestException('Reservation not found');
        }
        reservation.status = 'canc';
        return this.reservationRepository.save(reservation);
    }

    async endReservation(id: string) {
        const reservation = await this.getReservationById(id);
        if (!reservation) {
            throw new BadRequestException('Reservation not found');
        }
        reservation.status = 'ended';
        return this.reservationRepository.save(reservation);
    }

    async deleteReservation(id: string) {
        const reservation = await this.getReservationById(id);
        if (!reservation) {
            throw new BadRequestException('Reservation not found');
        }
        return this.reservationRepository.remove(reservation);
    }

    async getReservationsByUnifiedReservationId(unifiedReservationId: string) {
        return this.reservationRepository.find({ where: { unifiedReservation: { id: unifiedReservationId } } });
    }

}
