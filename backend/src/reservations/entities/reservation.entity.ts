
import { User } from "../../users/entities/user.entity";
import { Group } from "../../groups/entities/group.entity";
import { UnifiedReservation } from "../../unified-reservations/entities/unified-reservation.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled'
}

@Entity()
export class Reservation {

  @ApiProperty({ example: 'b1a2c3d4-5678-90ab-cdef-1234567890ab' })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ type: () => UnifiedReservation })
  @ManyToOne(() => UnifiedReservation, { nullable: false })
  unifiedReservation: UnifiedReservation;

  @ApiProperty({ type: () => Group })
  @ManyToOne(() => Group, { nullable: false })
  group: Group;

  @ApiProperty({ example: '2025-10-22T18:00:00.000Z' })
  @Column()
  date: Date;

  // @ApiProperty({ example: 'resource-id-123', description: 'ID de la pista/espacio reservado', required: false })
  // @Column()
  // resourceId: string;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, { nullable: false })
  createdBy: User;

  @ApiProperty({ example: 4, description: 'Número de plazas para esta reserva individual (por defecto 4 para pádel)' })
  @Column({ default: 4 })
  slots: number;

  @ApiProperty({ enum: ReservationStatus, example: ReservationStatus.PENDING })
  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING
  })
  status: ReservationStatus;

  @ApiProperty({ example: '2025-10-22T17:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2025-10-22T17:30:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;

}
