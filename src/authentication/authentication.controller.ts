import { Body, Req, Controller, Post, HttpCode, UseGuards, Res, Get } from '@nestjs/common';
import type { Response } from 'express';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/userRegister.dto';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import type RequestWithUser from './interface/requestWithUser.interface';
import { JwtAuthenticationGuard } from './jwtAuthentication.guard';

@Controller('authentication')
export class AuthenticationController{
    constructor(
        private readonly authenticationService: AuthenticationService
    ){}
    @Post('register')
    async register(@Body() registrationData: RegisterDto){   
        return this.authenticationService.register(registrationData);
    }     

    @HttpCode(200)
    @UseGuards(LocalAuthenticationGuard)
    @Post('login')
    async login(@Req() request: RequestWithUser, @Res() response: Response){        
        const { user } = request;
        const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
        response.setHeader('Set-Cookie', cookie);
        user.password = undefined;
        return response.send(user);
    }
    
    @UseGuards(JwtAuthenticationGuard)
    @Post('logout')
    async logout(@Req() request: RequestWithUser, @Res() response: Response){
        const cookie = this.authenticationService.getCookieForLogOut();
        response.setHeader('Set-Cookie', cookie);
        return response.sendStatus(200);
    }

    @UseGuards(JwtAuthenticationGuard)
    @Get()
    authenticated(@Req() request: RequestWithUser){
        const user = request.user;
        user.password = undefined;
        return user;
    }
}