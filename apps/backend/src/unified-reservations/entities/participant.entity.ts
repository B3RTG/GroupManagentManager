import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UnifiedReservation } from "./unified-reservation.entity";
import { User } from "../../users/entities/user.entity";

export enum ParticipantType {
    PRINCIPAL = 'principal',
    SUBSTITUTE = 'substitute',
    ELIMINADO = 'eliminado'
}

export enum ParticipantStatus {
    ACTIVE = 'active',
    PROMOTED = 'promoted',
    REMOVED = 'removed'
}

@Entity()
export class Participant {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UnifiedReservation, (ur) => ur.participants, { nullable: false })
    unifiedReservation: UnifiedReservation;

    @ManyToOne(() => User, { nullable: false })
    user: User;

    @Column({
        type: 'enum',
        enum: ParticipantType,
        default: ParticipantType.PRINCIPAL
    })
    type: ParticipantType;

    @Column({
        type: 'enum',
        enum: ParticipantStatus,
        default: ParticipantStatus.ACTIVE
    })
    status: ParticipantStatus;

    @CreateDateColumn()
    createdAt: Date;

}