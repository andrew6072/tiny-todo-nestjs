import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

export class CreateTodoDTO {
  readonly title: string;
  readonly description: string;

  @IsOptional()
  @IsEnum(['pending', 'in-progress', 'completed'])
  @ApiProperty({ 
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
    description: 'Status of todo',
  })
  readonly status: 'pending' | 'in-progress' | 'completed';
}