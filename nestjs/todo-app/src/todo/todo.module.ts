import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller'
import { TodoService } from './todo.service'
import { TodoRepository } from './todo.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo.entity';



@Module({
    imports: [
        TypeOrmModule.forFeature([Todo])
    ],
    controllers: [TodoController],
    providers: [TodoService, TodoRepository],
    exports: [TodoService, TypeOrmModule]
})
export class TodoModule {}
