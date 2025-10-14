import { User } from "../../users/entities/user.entity";
import { Group } from "../../groups/entities/group.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { UnifiedReservation, MatchParticipant, Guest } from "../../reservations/entities";


export enum MatchStatus {
  SCHEDULED = 'scheduled',
  ONGOING = 'ongoing',
  FINISHED = 'finished',
  CANCELLED = 'cancelled'
}

@Entity()
export class Match {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UnifiedReservation, ur => ur.matches)
  unifiedReservation: UnifiedReservation;

  @ManyToOne(() => Group)
  group: Group;


  @Column()
  sport: string;

  @Column()
  date: Date;

  @Column()
  time: string;

  @Column({
    type: 'enum',
    enum: MatchStatus,
    default: MatchStatus.SCHEDULED
  })
  status: MatchStatus; // scheduled, ongoing, finished, cancelled

  @Column({ default: 0 })
  maxParticipants: number;

  @Column({ default: 0 })
  maxSubstitutes: number;

  @OneToMany(() => MatchParticipant, (mp) => mp.match)
  participants: MatchParticipant[]; // Todos los inscritos (principal, suplente, eliminado)

  @OneToMany(() => Guest, (guest) => guest.match)
  guests: Guest[]; // Invitados (principal o suplente, según campo type)


  @ManyToOne(() => User)
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
