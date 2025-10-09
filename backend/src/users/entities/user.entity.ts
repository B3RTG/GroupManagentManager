import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { GroupMembership } from '../../groups/entities/group-membership.entity';

export type UserRole = 'user' | 'admin';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  googleId?: string;

  @Column({ nullable: true })
  facebookId?: string;

  @Column({ nullable: true })
  provider?: string;

  @Column()
  password: string;

  @Column('text', { array: true, nullable: true })
  preferredSports?: string[];

  @Column({
    type: 'enum',
    enum: ['user', 'admin'],
    default: 'user',
  })
  role: UserRole;

  @OneToMany(() => GroupMembership, (membership) => membership.user)
  memberships: GroupMembership[];
}
