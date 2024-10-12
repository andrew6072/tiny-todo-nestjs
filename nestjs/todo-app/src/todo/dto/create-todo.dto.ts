export class CreateTodoDTO {
  readonly title: string;
  readonly description: string;
  readonly status: 'pending' | 'in-progress' | 'completed';
}