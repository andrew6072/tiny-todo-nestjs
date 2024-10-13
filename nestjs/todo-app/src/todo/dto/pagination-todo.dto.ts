import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto<T> {
    @ApiProperty({ description: 'Current page number', example: 1 })
    page: number;

    @ApiProperty({ description: 'Number of items per page', example: 10 })
    per_page: number;

    @ApiProperty({ description: 'Total number of pages', example: 5 })
    total_pages: number;

    @ApiProperty({ description: 'Total number of todos', example: 50 })
    total_products: number;

    @ApiProperty({
        description: 'List of paginated items',
        isArray: true,
    })
    products: T[];  // This makes the DTO reusable with any type of data

    constructor(page: number, per_page: number, total_pages: number, total_todos: number, products: T[]) {
        this.page = page;
        this.per_page = per_page;
        this.total_pages = total_pages;
        this.total_products = total_todos;
        this.products = products;
    }
}
