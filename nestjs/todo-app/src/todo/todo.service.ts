import { ConflictException, Injectable, NotFoundException, Res } from '@nestjs/common';
import { CreateTodoDTO } from './dto/create-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { UpdateTodoDTO } from './dto/update-todo.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class TodoService {

    constructor(
        @InjectRepository(Todo)
        private readonly todoRepository: Repository<Todo>,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}
    
    async findAll(): Promise<Todo[]> {
        const data = await this.todoRepository.find(
           {relations: ['user'],}
        );
        return data;
    }

    async findOne(id: number): Promise<Todo> {
        const data = await this.todoRepository.findOne({ 
            relations: ['user'],
            where: { id },
        });
        if (!data) {
            throw new NotFoundException('TodoService.findOne: Todo not found!');
        }
        return data;
    }

    async create(createTodoDto: CreateTodoDTO): Promise<Todo> {
        const userId = createTodoDto.userId;
    
        // Find the user by ID
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
    

    async update(id: number, updateTodoDto: UpdateTodoDTO): Promise<Todo> {
        const statusSet = ['pending', 'in-progress', 'completed'];
        const todo = await this.findOne(id);

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

    async delete(id: number): Promise<Todo> {
        const todo = await this.findOne(id);
        
        if (!todo) {
            throw new NotFoundException('TodoService.delete: Todo not found!');
        }
        
        await this.todoRepository.remove(todo)
        return todo
    } 
}

