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
    ExecutionContext,
    Req,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDTO } from './dto/create-todo.dto';
import { UpdateTodoDTO } from './dto/update-todo.dto';
import { Role } from 'src/roles/role.entity';
import { Roles } from 'src/roles/roles.decorator';
import { User } from 'src/users/user.entity';
import { UserPayload } from 'src/auth/dto/auth-jwt-payload.dto';
import { GetAllTodoDto } from './dto/getall-todo.dto';

@Controller('todos')
export class TodoController {

    constructor(private readonly todoService: TodoService) {}

    // 1) create middleware for multiple used components like @Res()
    // 2) instead of getTodo() use get()
    // 
    @Roles(1,2)
    @Post('/')
    async create(@Req() req, @Res() res, @Body() createTodoDTO: CreateTodoDTO) {
        const userPayload: UserPayload = req.user;

        const newTodo = await this.todoService.create(userPayload, createTodoDTO);
        return res.status(HttpStatus.OK).json({
            message: 'TodoController.create: Successfull!',
            data: newTodo,
            statusCode: HttpStatus.OK,
        });
    }

    // Fetch all todos
    
    @Roles(1, 2)
    @Get('/')
    async getAll(
        @Req() req, 
        @Res() res,
        @Body() getAllTodoDto: GetAllTodoDto, 
    ) {
        // console.log("From TodoController.getAll: ", getAllTodoDto);
        const userPayload: UserPayload = req.user;

        const pagination = await this.todoService.findAll(userPayload, getAllTodoDto);
        return res.status(HttpStatus.OK).json({
            message: "TodoController.getAll: Successfull!",
            data: pagination.products,
            pagination: {
                'page': pagination.page,
                'per_page': pagination.per_page,
                'total_pages': pagination.total_pages,
                'total_products': pagination.total_products,
            },
            statusCode: HttpStatus.OK,
        });
    }

    @Roles(1,2)
    @Get('/:id')
    async getOne(@Req() req, @Res() res, @Param('id') todo_id) {
        const userPayload: UserPayload = req.user;
        const data = await this.todoService.findOne(userPayload, todo_id);
        return res.status(HttpStatus.OK).json({
            message: "TodoController.getOne: Successfull!",
            data: data,
            statusCode: HttpStatus.OK,
        });
    }

    @Roles(1,2)
    @Put('/')
    async update(
        @Req() req,
        @Res() res,
        @Query('id') id: number,
        @Body() updateTodoDTO: UpdateTodoDTO,
    ) {
        const userPayload: UserPayload = req.user;
        const editedTodo = await this.todoService.update(userPayload, id, updateTodoDTO);
        return res.status(HttpStatus.OK).json({
            message: 'TodoController.update: Todo has been successfully updated!',
            data: editedTodo,
            statusCode: HttpStatus.OK,
        });
    }

    // Delete a todo using ID
    @Roles(1,2)
    @Delete('/')
    async delete(@Req() req, @Res() res, @Query('id') id: number) {
        const userPayload: UserPayload = req.user;
        const deletedTodo = await this.todoService.delete(userPayload, id);
        return res.status(HttpStatus.OK).json({
            message: 'TodoController.delete: Todo has been deleted!',
            data: deletedTodo,
            statusCode: HttpStatus.OK,
        });
    }
}
