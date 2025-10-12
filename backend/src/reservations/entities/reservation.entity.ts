import { User } from "../../users/entities/user.entity";
import { Group } from "../../groups/entities/group.entity";
import { UnifiedReservation } from "../../unified-reservations/entities/unifiedReservation.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UnifiedReservation, { nullable: false })
  unifiedReservation: UnifiedReservation;

  @ManyToOne(() => Group, { nullable: false })
  group: Group;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  date: Date;

  @Column()
  courts: number;

  @ManyToOne(() => User, { nullable: false })
  creator: User;

}
