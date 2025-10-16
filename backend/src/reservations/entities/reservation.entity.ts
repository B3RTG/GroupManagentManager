import { User } from "../../users/entities/user.entity";
import { Group } from "../../groups/entities/group.entity";
import { UnifiedReservation } from "../../unified-reservations/entities/unified-reservation.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled'
}

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UnifiedReservation, { nullable: false })
  unifiedReservation: UnifiedReservation;

  @ManyToOne(() => Group, { nullable: false })
  group: Group;


  @Column()
  date: Date;

  @Column()
  resourceId: string; // ID de la pista/espacio reservado

  @ManyToOne(() => User, { nullable: false })
  createdBy: User;

  @Column({ default: 4 })
  slots: number; // Número de plazas para esta reserva individual (por defecto 4 para pádel)

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING
  })
  status: ReservationStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
