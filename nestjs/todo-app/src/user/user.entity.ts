// src/users/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Todo } from '../todo/todo.entity';  // Import the Todo entity to establish the relation

@Entity('users')  // The name of the table in the database
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  // One-to-Many relationship with the Todo entity
  @OneToMany(() => Todo, (todo) => todo.userId, { cascade: true })
  todos: Todo[];
}
