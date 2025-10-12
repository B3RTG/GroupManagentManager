import { User } from "../../users/entities/user.entity"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Guest {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string // Guest name or nickname

    @Column({ nullable: true })
    email?: string // Optional email for contact

    // Columna nulable to store the user that created the guest
    @ManyToOne(() => User, { nullable: true })
    createdBy?: User
}
