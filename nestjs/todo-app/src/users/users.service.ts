import { ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/roles/role.entity';


@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Role)
        private rolesRepository: Repository<Role>,
    ){}

    async findAll(): Promise<User[]> {
        const users = await this.usersRepository.find(
            {relations: ['role'],}
        );
        return users;
    }

    async findOne(username: string): Promise<User> {
        if (!username) {
            return null;
        }
        const data = await this.usersRepository.findOne({ 
            where: { username },
            relations: ['role'],
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
        if (!newUser.role) {
            const defaultRole = await this.rolesRepository.findOne({ where: { name: 'user' } });
            newUser.role = defaultRole;
        }
      
        await this.usersRepository.save(newUser);
        return newUser;
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const { username, email, password } = updateUserDto;
    
        const user = await this.usersRepository.findOne({
            where: { id: id },
            relations: ['role'],
        });
    
        if (!user) {
            throw new NotFoundException("UserService.update: This user id does not exist!");
        }
    
        if (username && username !== user.username) {
            const usernameExisted = await this.usersRepository.findOne({
                where: { username }
            });
            if (usernameExisted) {
                throw new ConflictException("UserService.update: This username already exists!");
            }
        }
    
        if (email && email !== user.email) {
            const emailExisted = await this.usersRepository.findOne({
                where: { email }
            });
            if (emailExisted) {
                throw new ConflictException("UserService.update: This email already exists!");
            }
        }
    
        // Update username and email if provided
        if (username) {
            user.username = username;
        }
        if (email) {
            user.email = email;
        }
    
        // Update password only if a new password is provided
        if (password) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            user.password = hashedPassword;
        }
    
        // Save the updated user in the database
        return await this.usersRepository.save(user);
    }

    async updateRole(userId: number, roleId: number): Promise<User> {
        // Find the user by ID
        const user = await this.usersRepository.findOne({
          where: { id: userId },
          relations: ['role'],
        });
    
        if (!user) {
          throw new NotFoundException(`UsersSerive.updateRole: User with ID ${userId} not found.`);
        }
    
        // Find the role by ID
        const role = await this.rolesRepository.findOne({
          where: { id: roleId },
        });
    
        if (!role) {
          throw new NotFoundException(`UsersSerive.updateRole: Role with ID ${roleId} not found.`);
        }
    
        // Assign the new role to the user
        user.role = role;
    
        // Save the updated user entity
        return await this.usersRepository.save(user);
    }
    
    async delete(id: number): Promise<void> {
        const user = await this.usersRepository.findOne({
          where: { id },
        });
    
        if (!user) {
          throw new NotFoundException(`UsersService.delete: User with ID ${id} not found`);
        }
    
        await this.usersRepository.delete(id);
    }
    
}
