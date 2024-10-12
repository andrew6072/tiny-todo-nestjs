import { ConflictException, Injectable, NotFoundException, Res, UnauthorizedException } from '@nestjs/common';
import { CreateTodoDTO } from './dto/create-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { UpdateTodoDTO } from './dto/update-todo.dto';
import { User } from 'src/users/user.entity';
import { UserPayload } from 'src/auth/dto/auth-jwt-payload.dto';

@Injectable()
export class TodoService {

    constructor(
        @InjectRepository(Todo)
        private readonly todoRepository: Repository<Todo>,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}
    
    async findAll(userPayload: UserPayload): Promise<Todo[]> {
        if (!userPayload) {
            throw new UnauthorizedException("TodoService.findAll: Unauthorized!");
        }

        const data = await this.todoRepository.find(
            {
                where: {
                    user : {
                        id: userPayload.sub,
                    }
                },
                relations: [/*'user'*/],
            }
        );
        return data;
    }

    async findOne(userPayload: UserPayload, todo_id: number): Promise<Todo> {
        if (!userPayload) {
            throw new UnauthorizedException("TodoService.findAll: Unauthorized!");
        }

        const data = await this.todoRepository.findOne({ 
            relations: ['user'],
            where: { id: todo_id },
        });
        if (!data) {
            throw new NotFoundException('TodoService.findOne: Todo not found!');
        }
        if (data.user.id != userPayload.sub) {
            throw new UnauthorizedException('TodoService.findOne: Unauthorized!');
        }
        return data;
    }

    async create(userPayload: UserPayload, createTodoDto: CreateTodoDTO): Promise<Todo> {
        if (!userPayload) {
            throw new UnauthorizedException("TodoService.create: Unauthorized!");
        }
        const userId = userPayload.sub;
    
        // Find the user by ID
        // TODO: Possible optimize, we can use userPayload instead of finding user one more time
        const foundUser = await this.usersRepository.findOne({ 
            where: { id: userId },  // Use the userRepository to fetch the user,
            relations: ['role'],
        });
    
        if (!foundUser) { 
            throw new NotFoundException('TodoService.create: User not found!');
        }
    
        // Create a new Todo and set the user object directly
        const newTodo = this.todoRepository.create({
            title: createTodoDto.title,
            description: createTodoDto.description,
            user: foundUser  // Set the user object as the foreign key relationship
        });
    
        // Save the new Todo
        return await this.todoRepository.save(newTodo);
    }
    

    async update(userPayload: UserPayload, id: number, updateTodoDto: UpdateTodoDTO): Promise<Todo> {
        if (!userPayload) {
            throw new UnauthorizedException("TodoService.create: Unauthorized!");
        }

        const statusSet = ['pending', 'in-progress', 'completed'];
        const todo = await this.findOne(userPayload, id);

        if (!todo) {
            throw new NotFoundException('TodoService.update: Todo not found!');
        }
        if (!statusSet.includes(updateTodoDto.status)) {
            throw new ConflictException('TodoService.update: Status not supported!');
        }
        // Update entity properties
        todo.title = updateTodoDto.title;
        todo.description = updateTodoDto.description;
        todo.status = updateTodoDto.status;

        // Save updated entity to the database
        return await this.todoRepository.save(todo);
    }

    async delete(userPayload:UserPayload, id: number): Promise<Todo> {
        if (!userPayload) {
            throw new UnauthorizedException("TodoService.create: Unauthorized!");
        }

        const todo = await this.findOne(userPayload, id);
        
        if (!todo) {
            throw new NotFoundException('TodoService.delete: Todo not found!');
        }
        
        await this.todoRepository.remove(todo)
        return todo
    } 
}

