import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDateString, IsEnum, IsInt, IsOptional, ValidateIf } from "class-validator";

export const validSortByFields = ['id', 'title', 'created_at', 'updated_at'];
export const validSortOrderFields = ['ASC', 'DESC'];
export const validStatusFields = ['pending', 'in-progress', 'completed'];

export class GetAllTodoDto {
  constructor () {
    
  }
    // pagination parameters
    @IsOptional()
    @IsInt()
    @ApiProperty({ default: 1, description: 'Page number' })
    page: number = 1;

    @IsOptional()
    @IsInt()
    @ApiProperty({ default: 10, description: 'Number of items per page' })
    per_page: number;

    // sorting options
    @IsOptional()
    @IsEnum(validSortByFields)
    @ApiProperty({ 
        enum: validSortByFields,
        default: 'id',
        description: 'Field to sort by'
    })
    sort_by: 'id' | 'title' | 'created_at' | 'updated_at' = 'id'; // = id means default value
    
    @IsOptional()
    @IsEnum(validSortOrderFields)
    @ApiProperty({ 
        enum: validSortOrderFields,
        default: 'ASC',
        description: 'Sort order'
    })
    sort_order: 'ASC' | 'DESC' = 'ASC';

    // filtering options
    @IsOptional()
    @IsEnum(validStatusFields, { message: 'Status must be one of: pending, in-progress, completed' })
    @ApiProperty({
      enum: validStatusFields,
      description: 'Filter by todo status',
      required: false,
      example: 'completed',
    })
    status?: 'pending' | 'in-progress' | 'completed';
  
    @IsOptional()
    @IsArray()
    @IsDateString({}, {each: true})
    @ValidateIf(o => o.time && o.time.length === 2) // Only validate if time is an array of length 2
    @ApiProperty({
      type: [String],
      description: 'Filter by a date range for created_at field. Must contain exactly 2 date strings',
      example: ['2024-10-11', '2024-10-13'],
    })
    time?: string[];  // Array of two ISO date strings for filtering by date range
}