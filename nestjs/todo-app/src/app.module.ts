import { Module } from '@nestjs/common';
import { TodoController } from './todo/todo.controller';
import { TodoService } from './todo/todo.service';
import { TodoModule } from './todo/todo.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { TodoRepository } from './todo/todo.repository';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    TodoModule,
    UsersModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    RolesModule,
  ],
  controllers: [TodoController],
  providers: [TodoService],
})
export class AppModule {}
