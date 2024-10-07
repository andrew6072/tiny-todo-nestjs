export class CreateTodoDTO {
  readonly userId: number;
  readonly title: string;
  readonly description: string;
  readonly status: 'pending' | 'in-progress' | 'completed';
}