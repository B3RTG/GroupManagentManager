import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "./group.entity";
import { User } from "src/users/entities/user.entity";

export type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired';

@Entity()
export class GroupInvitation {
    // Define aquí las propiedades y relaciones de la entidad GroupInvitation
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Group, { nullable: false, onDelete: 'CASCADE', eager: true })
    group: Group;

    @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE', eager: true })
    invitedUser: User | null;

    @Column({
        type: 'enum',
        enum: ['pending', 'accepted', 'declined', 'expired'],
        default: 'pending'
    })
    status: InvitationStatus;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    expiresAt: Date | null;
}