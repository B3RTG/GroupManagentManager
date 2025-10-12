import { Group } from "../../groups/entities/group.entity";
import { Match } from "../../matches/entities/match.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Reservation } from "../../reservations/entities/reservation.entity";
import { User } from "../../users/entities/user.entity";

@Entity()
export class UnifiedReservation {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: Date;

  @ManyToOne(() => Group)
  group: Group;

  @Column()
  totalSlots: number;

  @OneToMany(() => Reservation, reservation => reservation.unifiedReservation)
  reservations: Reservation[];

  @OneToMany(() => Match, match => match.unifiedReservation)
  matches: Match[];

  @ManyToOne(() => User, { nullable: false })
  creator: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
