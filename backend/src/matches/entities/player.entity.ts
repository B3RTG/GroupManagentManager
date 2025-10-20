import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from "typeorm";
import { Match } from "./match.entity";
import { User } from "../../users/entities/user.entity";
import { Guest } from "../../unified-reservations/entities";

export enum PlayerType {
    USER = 'user',
    GUEST = 'guest'
}

@Entity()
export class Player {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Match, (match) => match.players, { nullable: false })
    match: Match;

    @ManyToOne(() => User, { nullable: true })
    user?: User;

    @ManyToOne(() => Guest, { nullable: true })
    guest?: Guest;

    @Column({ type: 'enum', enum: PlayerType })
    type: PlayerType;

    @Column({ nullable: true })
    team?: string;

    @Column({ nullable: true })
    stats?: string; // JSON o string con estadísticas

    @CreateDateColumn()
    createdAt: Date;
}
