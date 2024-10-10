import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { sign } from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { Public } from './constants';
import { Roles } from 'src/roles/roles.decorator';

@Controller('auth')
export class AuthController {

    constructor (private authService: AuthService) {}

    @Public()
    @Post('login')
    async signIn(@Res() res, @Body() signInDto: SignInDto) {
        const response = await this.authService.signIn(signInDto);
        return res.status(HttpStatus.OK).json({
            message: 'AuthController.signIn: Sign in successfull!', 
            data: response,
            statusCode: HttpStatus.OK,
        });
    }

    @Public()
    @Post('register')
    async register(@Res() res, @Body() registerDto: RegisterDto) {
        const response = await this.authService.register(registerDto);
        return res.status(HttpStatus.OK).json({
            message: 'AuthController.resgister: Register successfull!', 
            data: response,
            statusCode: HttpStatus.OK,
        });
    }


    @Roles(2)
    @Get('profile')
    getProfile(@Res() res, @Req() req) {
        console.log(req.user);
        return res.status(HttpStatus.OK).json({
            message: 'AuthController.profile: Successfull!', 
            data: req.user,
            statusCode: HttpStatus.OK,
        });
    } 
}
