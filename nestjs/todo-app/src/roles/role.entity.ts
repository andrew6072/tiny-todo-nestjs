import { User } from "../users/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column() 
    name: string;

    @OneToMany(() => User, user => user.role)
    users: User[];
}