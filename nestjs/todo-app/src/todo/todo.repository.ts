import { Todo } from './todo.entity';
import { Repository } from 'typeorm';

export class TodoRepository extends Repository<Todo> {
  // Thêm các phương thức tùy chỉnh nếu cần
}