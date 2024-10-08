import { Module } from '@nestjs/common';
import { TodoController } from './todo/todo.controller';
import { TodoService } from './todo/todo.service';
import { TodoModule } from './todo/todo.module';
import { UsersModule } from './user/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { TodoRepository } from './todo/todo.repository';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TodoModule,
    UsersModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
  ],
  controllers: [TodoController],
  providers: [TodoService],
})
export class AppModule {}
