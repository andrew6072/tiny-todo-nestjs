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
import { UpdateTodoDTO } from './dto/update-todo.dto';


@Controller('todos')
export class TodoController {

    constructor(private readonly todoService: TodoService) {}

    @Post('/')
    async create(@Res() res, @Body() createTodoDTO: CreateTodoDTO) {
        const newTodo = await this.todoService.create(createTodoDTO);
        if (!newTodo) {
            throw new ConflictException('Todo with the same id already exists.')
        }
        return res.status(HttpStatus.OK).json({
            message: 'Todo has been submitted successfully!',
            data: newTodo,
        });
    }

    // Fetch all todos
    @Get('/')
    async getAll(@Res() res) {
        const data = await this.todoService.findAll();
        return res.status(HttpStatus.OK).json(data);
    }

    @Get('/:id')
    async getOne(@Res() res, @Param('id') id) {
        const data = await this.todoService.findOne(id);
        return res.status(HttpStatus.OK).json(data);
    }

    @Put('/')
    async update(
        @Res() res,
        @Query('id') id,
        @Body() updateTodoDTO: UpdateTodoDTO,
    ) {
        const editedTodo = await this.todoService.update(parseInt(id), updateTodoDTO);
        if (!editedTodo) {
            throw new NotFoundException('Todo does not exist!');
        }
        return res.status(HttpStatus.OK).json({
            message: 'Todo has been successfully updated',
            data: editedTodo,
        });
    }

    // Delete a todo using ID
    @Delete('/')
    async delete(@Res() res, @Query('id') id) {
        const deletedTodo = await this.todoService.delete(parseInt(id));
        
        if (!deletedTodo) {
            throw new NotFoundException('Todo does not exist!');
        }
        return res.status(HttpStatus.OK).json({
            message: 'Todo has been deleted!',
            data: deletedTodo,
        });
    }
}