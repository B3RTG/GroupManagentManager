import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { UnifiedReservation } from "./unified-reservation.entity";
import { User } from "../../users/entities/user.entity";

export enum GuestStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected'
}

export enum GuestType {
    PRINCIPAL = 'principal',
    SUBSTITUTE = 'substitute'
}

@Entity()
export class Guest {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UnifiedReservation, (ur) => ur.guests, { nullable: false })
    unifiedReservation: UnifiedReservation;

    @Column()
    name: string; // Guest name or nickname

    @Column({ nullable: true })
    email?: string; // Optional email for contact

    @Column({
        type: 'enum',
        enum: GuestStatus,
        default: GuestStatus.PENDING
    })
    status: GuestStatus;

    @Column({
        type: 'enum',
        enum: GuestType,
        default: GuestType.PRINCIPAL
    })
    type: GuestType;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, { nullable: false })
    createdBy: User;

}