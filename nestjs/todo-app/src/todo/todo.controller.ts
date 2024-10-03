// /nest-todo-app/src/todo/todo.controller.ts
import {
    Controller,
    Get,
    Res,
    HttpStatus,
    Param,
    NotFoundException,
    Body,
    Put,
    Query,
    Delete,
    Post,
    ConflictException,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDTO } from './dto/create-todo.dto';


@Controller('todos')
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    // Create a todo
    @Post('/')
    // 1) create middleware for multiple used components like @Res()
    // 2) instead of getTodo() use get()
    // 
    async create(@Res() res, @Body() createTodoDTO: CreateTodoDTO) {
        const newTodo = await this.todoService.addTodo(createTodoDTO);
        if (!newTodo) {
            throw new ConflictException('Todo with the same id already exists.')
        }
        return res.status(HttpStatus.OK).json({
            message: 'Todo has been submitted successfully!',
            todo: newTodo,
            // use `data` instead of `todo` because we are in todo module, no need to specifically name todo.
        });
    }

    // Fetch a particular todo using ID
    @Get('/:todoID')
    async getTodo(@Res() res, @Param('todoID') todoID) {
        const todo = await this.todoService.getTodo(parseInt(todoID));
        if (!todo) {
            throw new NotFoundException('Todo does not exist!');
        }
        return res.status(HttpStatus.OK).json(todo);
    }

    // Fetch all todos
    @Get('/')
    async getTodos(@Res() res) {
        const todos = await this.todoService.getTodos();
        return res.status(HttpStatus.OK).json(todos);
    }

    // Edit a particular todo using ID
    @Put('/')
    async editTodo(
        @Res() res,
        @Query('todoID') todoID,
        @Body() createTodoDTO: CreateTodoDTO,
    ) {
        const editedTodo = await this.todoService.editTodo(parseInt(todoID), createTodoDTO);
        if (!editedTodo) {
            throw new NotFoundException('Todo does not exist!');
        }
        return res.status(HttpStatus.OK).json({
            message: 'Todo has been successfully updated',
            todo: editedTodo,
        });
    }

    // Delete a todo using ID
    @Delete('/delete')
    async deleteTodo(@Res() res, @Query('todoID') todoID) {
        const deletedTodo = await this.todoService.deleteTodo(parseInt(todoID));
        if (!deletedTodo) {
            throw new NotFoundException('Todo does not exist!');
        }
        return res.status(HttpStatus.OK).json({
            message: 'Todo has been deleted!',
            todo: deletedTodo,
        });
    }
}
