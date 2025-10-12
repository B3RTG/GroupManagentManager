import { User } from "../../users/entities/user.entity";
import { Group } from "../../groups/entities/group.entity";
import { UnifiedReservation } from "../../unified-reservations/entities/unifiedReservation.entity";
import { Column, Entity, ManyToOne, ManyToMany, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Guest } from "./guest.entity";

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
  maxParticipants: number;

  @ManyToMany(() => User)
  @JoinTable()
  participants: User[];

  @ManyToMany(() => User)
  @JoinTable()
  substitutes: User[];

  @ManyToMany(() => Guest, { cascade: true })
  @JoinTable()
  guests: Guest[];

  @ManyToOne(() => User)
  createdBy: User;
}
