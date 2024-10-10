import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller'
import { TodoService } from './todo.service'
import { TodoRepository } from './todo.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/users/user.entity';
import { RolesGuard } from 'src/auth/guards/auth.roles.guard';

@Module({
    imports: [
        TypeOrmModule.forFeature([Todo]),
        TypeOrmModule.forFeature([User])
    ],
    controllers: [TodoController],
    providers: [
        TodoService, 
        TodoRepository,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard
        },
    ],
    exports: [TodoService, TypeOrmModule]
})
export class TodoModule {}
