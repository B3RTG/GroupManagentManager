export enum UnifiedReservationStatus {
    ACTIVE = 'active',
    CANCELLED = 'cancelled',
    FINISHED = 'finished'
}
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Group } from "../../groups/entities/group.entity";
import { Match } from "../../matches/entities/match.entity";
import { Participant } from "./participant.entity";
import { Guest } from "./guest.entity";

@Entity()
export class UnifiedReservation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Group, { nullable: false })
    group: Group;

    @Column()
    date: Date;

    @Column()
    time: string;

    @Column({
        type: 'enum',
        enum: UnifiedReservationStatus,
        default: UnifiedReservationStatus.ACTIVE
    })
    status: UnifiedReservationStatus; // active, cancelled, finished

    @OneToMany(() => Match, (match) => match.unifiedReservation)
    matches: Match[];


    @OneToMany(() => Participant, (p) => p.unifiedReservation)
    participants: Participant[]; // Todos los inscritos (principal, suplente, eliminado)

    @OneToMany(() => Guest, (guest) => guest.unifiedReservation)
    guests: Guest[]; // Invitados (principal o suplente, según campo type)

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
