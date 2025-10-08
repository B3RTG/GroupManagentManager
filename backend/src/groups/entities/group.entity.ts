import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => User)
  @JoinTable()
  administrators: User[];

  @ManyToOne(() => User, { nullable: true })
  mainAdministrator: User;

  @ManyToMany(() => User)
  @JoinTable()
  members: User[];

  @Column({ default: false })
  allCanManageEvents: boolean;
}
