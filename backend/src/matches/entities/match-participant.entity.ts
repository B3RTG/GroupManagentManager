import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from "typeorm";
import { Match } from "./match.entity";
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
export class MatchParticipant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Match, (match) => match.participants, { nullable: false })
    match: Match;

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
