import { User } from "../users/user.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column() 
    name: string;

    @ManyToMany(() => User, user => user.roles)
    users: User[];
}