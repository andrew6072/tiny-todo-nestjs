import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from 'src/roles/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { Public } from 'src/auth/constants';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService){}

    @Roles(1,2)
    @Get('/:username')
    async getOne(@Res() res, @Param('username') username:string) {
        const data = await this.usersService.findOne(username);
        if (!data) {
            return res.status(HttpStatus.NOT_FOUND).json(
                {
                    message: "UserController.getOne: User not found!",
                    data: null,
                    statusCode: HttpStatus.NOT_FOUND,
                }
            );
        }
        return res.status(HttpStatus.OK).json({
            message: "UserController.getOne: Successfull!",
            data: data,
            statusCode: HttpStatus.OK,
        });
    }

    @Roles(1,2)
    @Get('/')
    async getAll(@Res() res) {
        const data = await this.usersService.findAll();
        return res.status(HttpStatus.OK).json({
            message: "UserController.getAll: Successfull!",
            data: data,
            statusCode: HttpStatus.OK,
        });
    }

    @Roles(1,2)
    @Post('/')
    async create(@Res() res, @Body() createUserDto: CreateUserDto) {
        const newData = await this.usersService.create(createUserDto);
        return res.status(HttpStatus.OK).json({
            message: 'UserController.create: User has been registred successfully!',
            data: newData,
            statusCode: HttpStatus.OK,
        });
    }

    @Roles(1,2)
    @Put()
    async update(
        @Res() res, 
        @Query('id') id: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        const newData = await this.usersService.update(id, updateUserDto);
        return res.status(HttpStatus.OK).json({
            message: 'UserController.update: User has been updated successfully!',
            data: newData,
            statusCode: HttpStatus.OK,
        });
    }

    @Roles(2)
    @Post(':id/assign-roles')
    async assignRoles(
        @Res() res, 
        @Param('id', ParseIntPipe) userId: number,
        @Body('roleIds') roleIds: number[]
    ) {
        const data = await this.usersService.assignRoles(userId, roleIds);
        return res.status(HttpStatus.OK).json({
            message: 'UsersController.assignTodo: Successfull!',
            data: data,
            statusCode: HttpStatus.OK,
        });
    }

    @Roles(1,2)
    @Delete('/')
    async delete(@Res() res, @Query('id') id: number) {
        const deletedTodo = await this.usersService.delete(id);
        return res.status(HttpStatus.OK).json({
            message: 'UsersController.delete: User has been deleted!',
            data: deletedTodo,
            statusCode: HttpStatus.OK,
        });
    }
}
