import { User } from "../../users/entities/user.entity"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm"
import { Match } from "./match.entity";

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
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string // Guest name or nickname

    @Column({ nullable: true })
    email?: string // Optional email for contact

    @ManyToOne(() => Match, (match) => match.guests, { nullable: false })
    match: Match;

    @ManyToOne(() => User, { nullable: true })
    createdBy?: User;

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
}
