import { ConflictException, Injectable, NotFoundException, Res } from '@nestjs/common';
import { CreateTodoDTO } from './dto/create-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { UpdateTodoDTO } from './dto/update-todo.dto';

@Injectable()
export class TodoService {

    constructor(
        @InjectRepository(Todo)
        private readonly todoRepository: Repository<Todo>,
    ) {}
    
    async findAll(): Promise<Todo[]> {
        const data = await this.todoRepository.find();
        return data;
    }

    async findOne(id: number): Promise<Todo> {
        const data = await this.todoRepository.findOne({ 
            where: { id }
        });
        if (!data) {
            throw new NotFoundException('Data not found');
        }
        return data;
    }

    async create(createTodoDto: CreateTodoDTO): Promise<Todo> {
        // ? Do we need to check if userId is present in DB O(n) ?
        // Or we can hanle this issue by only let existed user to create Todo
        const newTodo = this.todoRepository.create({
            title: createTodoDto.title,
            description: createTodoDto.description,
            userId: createTodoDto.userId,  // Assuming you pass the userId from the request
        });
        return await this.todoRepository.save(newTodo);
    }

    async update(id: number, updateTodoDto: UpdateTodoDTO): Promise<Todo> {
        const statusSet = ['pending', 'in-progress', 'completed'];
        const todo = await this.findOne(id);

        if (!todo) {
            throw new NotFoundException('Todo not found');
        }
        if (!statusSet.includes(updateTodoDto.status)) {
            throw new ConflictException('Status not supported');
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
            throw new NotFoundException('Todo not found');
        }
        
        await this.todoRepository.remove(todo)
        return todo
    } 
}

