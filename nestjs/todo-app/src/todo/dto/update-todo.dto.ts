export class UpdateTodoDTO {
    readonly title: string;
    readonly description: string;
    readonly status: 'pending' | 'in-progress' | 'completed';
}