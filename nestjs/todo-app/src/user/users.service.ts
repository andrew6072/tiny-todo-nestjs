import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ){}

    async findAll(): Promise<User[]> {
        const users = await this.usersRepository.find();
        return users;
    }

    async findOne(username: string): Promise<User> {
        const data = await this.usersRepository.findOne({ 
            where: { username }
        });
        return data;
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existedUsername = await this.findOne(createUserDto.username);
        if (existedUsername) {
            throw new ConflictException('UserService.create: This username is already exists!');
        }

        const existedEmail = await this.usersRepository.findOneBy({
            email: createUserDto.email
        });
        if (existedEmail) {
            throw new ConflictException('UserService.create: This email is already exists!');
        }
        
        const newUser = this.usersRepository.create({
            username: createUserDto.username,
            email: createUserDto.email,
            password: createUserDto.password,
        });
        await this.usersRepository.save(newUser);
        return newUser;
    }
}
