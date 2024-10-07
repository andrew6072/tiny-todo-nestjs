// src/config/typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Todo } from '../todo/todo.entity';
import * as dotenv from 'dotenv'
dotenv.config();


// create an object of TypeOrmModuleOptions class 
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE,
  entities: [User, Todo],  // Register entities
  synchronize: true,       // Auto synchronize schema with database (disable in production),
};
