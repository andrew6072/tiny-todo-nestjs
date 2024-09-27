import { ConflictException, Injectable } from '@nestjs/common';
import { CreateTodoDTO } from './dto/create-todo.dto';

// Creates a Todo interface to show exactly the attribute of our Todo
interface Todo {
    readonly id: number;
    readonly title: string;
    readonly description: string;
    readonly isDone: boolean;
  }

@Injectable()
export class TodoService {
    // Creates a Todo array with one Todo
    private todos: Todo[] = [
        {
            id: 1,
            title: 'Test',
            description: 'This is a test Tod',
            isDone: true,
        },
        {
            id: 3,
            title: "XXX",
            description: "YYY",
            isDone: true
        },
        {
            id: 4,
            title: "XXX",
            description: "YYY",
            isDone: true
        },
        {
            id: 5,
            title: "XXX",
            description: "YYY",
            isDone: true
        },
        {
            id: 88,
            title: "X",
            description: "Y",
            isDone: true
        }
    ];

    async existedTodo(todoID: number): Promise<boolean> {
        return this.todos.some(todo => todo.id === todoID)
    }

    // Creates a new todo (Add todo to array)
    async addTodo(createTodoDTO: CreateTodoDTO): Promise<Todo> {
        if (await this.existedTodo(createTodoDTO.id)){
            return null;
        }
        this.todos.push(createTodoDTO);
        return this.todos.at(-1);
    }

    // Returns a single todo with ID
    async getTodo(todoID: number): Promise<Todo> {
        const todo = this.todos.find((todo) => todo.id === todoID);
        return todo;
    }

    // Returns all todos available
    async getTodos(): Promise<Todo[]> {
        return this.todos;
    }

    // Deletes a todo by ID and add a new one (Update process)
    async editTodo(postID: number, createTodoDTO: CreateTodoDTO): Promise<Todo> {
        if (! await this.existedTodo(postID)) {
            return null;
        }
        if (await this.existedTodo(createTodoDTO.id)) {
            throw new ConflictException("This new ID already exists.")
        }
        await this.deleteTodo(postID);
        this.todos.push(createTodoDTO);
        return this.todos.at(-1);
    }

    // Deletes a todo from the array
    async deleteTodo(todoID: number): Promise<any> {
        if (! await this.existedTodo(todoID)){
            return null;
        }
        const todoIndex = this.todos.findIndex((todo) => todo.id === todoID);
        return this.todos.splice(todoIndex, 1);
    }
}

