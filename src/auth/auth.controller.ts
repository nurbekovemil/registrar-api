import {Body, Controller, Get, Post, Request, UseGuards} from '@nestjs/common';


import {AuthService} from "./auth.service";
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post('/login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/check-auth')
    auth(@Request() req) {
        return this.authService.auth(req.user)    
    }

}
