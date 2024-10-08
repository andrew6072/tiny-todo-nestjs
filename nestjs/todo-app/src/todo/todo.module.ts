import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller'
import { TodoService } from './todo.service'
import { TodoRepository } from './todo.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
    imports: [
        TypeOrmModule.forFeature([Todo])
    ],
    controllers: [TodoController],
    providers: [
        TodoService, 
        TodoRepository,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        }
    ],
    exports: [TodoService, TypeOrmModule]
})
export class TodoModule {}
