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
import { Role } from 'src/roles/role.entity';
import { Roles } from 'src/roles/roles.decorator';


@Controller('todos')
export class TodoController {

    constructor(private readonly todoService: TodoService) {}

    // 1) create middleware for multiple used components like @Res()
    // 2) instead of getTodo() use get()
    // 
    @Roles(1,2)
    @Post('/')
    async create(@Res() res, @Body() createTodoDTO: CreateTodoDTO) {
        const newTodo = await this.todoService.create(createTodoDTO);
        return res.status(HttpStatus.OK).json({
            message: 'TodoController.create: Successfull!',
            data: newTodo,
            statusCode: HttpStatus.OK,
        });
    }

    // Fetch all todos
    @Roles(2)
    @Get('/')
    async getAll(@Res() res) {
        const data = await this.todoService.findAll();
        return res.status(HttpStatus.OK).json({
            message: "TodoController.getAll: Successfull!",
            data: data,
            statusCode: HttpStatus.OK,
        });
    }

    @Roles(1,2)
    @Get('/:id')
    async getOne(@Res() res, @Param('id') id) {
        const data = await this.todoService.findOne(id);
        return res.status(HttpStatus.OK).json({
            message: "TodoController.getOne: Successfull!",
            data: data,
            statusCode: HttpStatus.OK,
        });
    }

    @Roles(1,2)
    @Put('/')
    async update(
        @Res() res,
        @Query('id') id,
        @Body() updateTodoDTO: UpdateTodoDTO,
    ) {
        const editedTodo = await this.todoService.update(parseInt(id), updateTodoDTO);
        return res.status(HttpStatus.OK).json({
            message: 'TodoController.update: Todo has been successfully updated!',
            data: editedTodo,
            statusCode: HttpStatus.OK,
        });
    }

    // Delete a todo using ID
    @Roles(1,2)
    @Delete('/')
    async delete(@Res() res, @Query('id') id) {
        const deletedTodo = await this.todoService.delete(parseInt(id));
        return res.status(HttpStatus.OK).json({
            message: 'TodoController.delete: Todo has been deleted!',
            data: deletedTodo,
            statusCode: HttpStatus.OK,
        });
    }
}
