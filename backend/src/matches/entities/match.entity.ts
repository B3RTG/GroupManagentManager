import { User } from "../../users/entities/user.entity";
import { Group } from "../../groups/entities/group.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { UnifiedReservation } from "../../unified-reservations/entities";
import { Player } from "./player.entity";


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
  date: Date;

  @Column()
  time: string;

  @Column({
    type: 'enum',
    enum: MatchStatus,
    default: MatchStatus.SCHEDULED
  })
  status: MatchStatus; // scheduled, ongoing, finished, cancelled

  @Column({ nullable: true })
  result?: string; // Match result (JSON, string, etc.)

  @OneToMany(() => Player, (player) => player.match)
  players: Player[]; // Todos los inscritos (principal, suplente, eliminado)

  @ManyToOne(() => User)
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
