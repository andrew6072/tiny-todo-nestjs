import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async signIn(signInDto: SignInDto): Promise<{ access_token: string}> {
        const username = signInDto.username;
        const pass = signInDto.password;

        const user = await this.usersService.findOne(username);
        if (!user || !(await bcrypt.compare(pass, user.password))) {
            throw new UnauthorizedException("AuthService.signIn: Invalid username or password");
        }
        const payload = {
            sub: user.id,
            username: user.username,
            role: user.role // add role here for authorization
        };
        // generate JWT from a subset of the user object properties (user.id, user.username)
        return {access_token: await this.jwtService.signAsync(payload)};
    }

    async register(registerDto: RegisterDto): Promise<void> {
        const username = registerDto.username;
        const email = registerDto.email;
        const plainPassword = registerDto.password;

        const user = await this.usersService.findOne(username);
        if (user) {
          throw new ConflictException("AuthService.register: This username is already taken");
        }
  
        const saltRounds = 10; // You can adjust the salt rounds for hashing
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  
        // Create and save the new user (you would implement this method in UsersService)
        const newUser = {
          username: username,
          email: email,
          password: hashedPassword,
        };
  
        await this.usersService.create(newUser);
    }
}
