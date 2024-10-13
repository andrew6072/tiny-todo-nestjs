import { BadRequestException, ConflictException, Injectable, NotFoundException, Res, UnauthorizedException } from '@nestjs/common';
import { CreateTodoDTO } from './dto/create-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { UpdateTodoDTO } from './dto/update-todo.dto';
import { User } from 'src/users/user.entity';
import { UserPayload } from 'src/auth/dto/auth-jwt-payload.dto';
import { GetAllTodoDto, validSortByFields, validSortOrderFields, validStatusFields } from './dto/getall-todo.dto';
import { PaginationDto } from './dto/pagination-todo.dto';

@Injectable()
export class TodoService {

    constructor(
        @InjectRepository(Todo)
        private readonly todoRepository: Repository<Todo>,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}
    
    async findAll(userPayload: UserPayload, getAllTodoDto: GetAllTodoDto): Promise<PaginationDto<Todo>> {
        if (!userPayload) {
            throw new UnauthorizedException("TodoService.findAll: Unauthorized!");
        }
        if (getAllTodoDto.page < 1 || getAllTodoDto.per_page < 1){
            throw new BadRequestException('TodoService.findAll: Invalid pagination parameters')
        }
        // console.log("From TodoService.findAll:", getAllTodoDto);
        const {
            page = 1,
            per_page = 10,
            sort_by = 'id',
            sort_order = 'ASC',
            status,
            time
        } = {
            page: getAllTodoDto.page || 1,  // Default to 1 if page is empty or undefined
            per_page: getAllTodoDto.per_page || 10,  // Default to 10 if per_page is empty or undefined
            sort_by: getAllTodoDto.sort_by?.trim() || 'id',  // Default to 'id' if sort_by is empty or undefined
            sort_order: getAllTodoDto.sort_order?.trim() || 'ASC',  // Default to 'ASC' if sort_order is empty or undefined
            status: getAllTodoDto.status?.trim() || undefined,  // Only set status if not empty
            time: (getAllTodoDto.time && getAllTodoDto.time.length === 2) ? getAllTodoDto.time : undefined  // Only set time if it's an array of 2 dates
        };

        if (!validSortByFields.includes(sort_by)) {
            throw new BadRequestException(`TodoService.findAll: Invalid sort_by field: ${sort_by}. Allowed values are ${validSortByFields.join(', ')}`);
        }

        if (!validSortOrderFields.includes(sort_order)) {
            throw new BadRequestException(`TodoService.findAll: Invalid sort_order field: ${sort_order}. Allowed values are ${validSortOrderFields.join(', ')}`);
        }

        if (status && !validStatusFields.includes(status)) {
            throw new BadRequestException(`TodoService.findAll: Invalid status: ${status}. Allowed values are ${validStatusFields.join(', ')}`);
        }

        // Initialize query to find todos by user
        const query = this.todoRepository.createQueryBuilder('todo')
            .where('todo.userId = :userId', { userId: userPayload.sub });

        // Apply status filter if provided
        if (status) {
            query.andWhere('todo.status = :status', { status });
        }

        // Apply time range filter for created_at if both dates are provided
        if (time && time.length === 2) {
            query.andWhere('todo.created_at BETWEEN :startDate AND :endDate', {
                startDate: time[0],
                endDate: time[1],
            });
        }

        // Apply sorting based on `sort_by` and `sort_order`
        query.orderBy(`todo.${sort_by}`, sort_order as 'ASC' | 'DESC');

        // Execute the query to get all todos matching the conditions
        const todos = await query.getMany();

        // Validate page number
        const totalTodos = todos.length;
        const totalPages = Math.ceil(totalTodos / per_page);  // Calculate total pages

        if (page > totalPages) {
            throw new BadRequestException('TodoService.findAll: Invalid page number: Total number of pages is ' + totalPages + ' you prompted ' + page); 
        }

        // Pagination logic: extract the required page of results
        const startIndex = (page - 1) * per_page;
        const endIndex = Math.min(startIndex + per_page, todos.length); // Ensure we don't exceed the array length
        const paginatedTodos = todos.slice(startIndex, endIndex); // Paginate the results
        const paginationDto = new PaginationDto<Todo>(
            page,
            per_page,
            totalPages,
            totalTodos,
            paginatedTodos
        );
        return paginationDto;
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
        // console.log("From TodoService.create:", createTodoDto);
        if (!userPayload) {
            throw new UnauthorizedException("TodoService.create: Unauthorized!");
        }
        const userId = userPayload.sub;

        const validstatus = ['pending', 'in-progress', 'completed'];
        if (!validstatus.includes(createTodoDto.status)) {
            throw new ConflictException('TodoService.create: Invalid status!');
        }
    
        // Find the user by ID
        // TODO: Possible optimize, we can use userPayload instead of finding user one more time
        const foundUser = await this.usersRepository.findOne({ 
            where: { id: userId },  // Use the userRepository to fetch the user,
            relations: ['roles'],
        });
    
        if (!foundUser) { 
            throw new NotFoundException('TodoService.create: User not found!');
        }
    
        // Create a new Todo and set the user object directly
        const newTodo = this.todoRepository.create({
            title: createTodoDto.title,
            description: createTodoDto.description,
            user: foundUser,  // Set the user object as the foreign key relationship
            status: createTodoDto.status,
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

