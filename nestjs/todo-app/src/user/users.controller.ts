import { Body, ConflictException, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService){}

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

    @Get('/')
    async getAll(@Res() res) {
        const data = await this.usersService.findAll();
        return res.status(HttpStatus.OK).json({
            message: "UserController.getAll: Successfull!",
            data: data,
            statusCode: HttpStatus.OK,
        });
    }

    @Post('/')
    async create(@Res() res, @Body() createUserDto: CreateUserDto) {
        const newData = await this.usersService.create(createUserDto);
        return res.status(HttpStatus.OK).json({
            message: 'UserController.create: User has been registred successfully!',
            data: newData,
            statusCode: HttpStatus.OK,
        });
    }
}
