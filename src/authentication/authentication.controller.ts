import { Body, Req, Controller, Post, HttpCode, UseGuards, Res, Get, UseInterceptors, ClassSerializerInterceptor, SerializeOptions } from '@nestjs/common';
import type { Response } from 'express';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/userRegister.dto';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import type RequestWithUser from './interface/requestWithUser.interface';
import { JwtAuthenticationGuard } from './jwtAuthentication.guard';
import UsersService from 'src/users/users.service';
import JwtRefreshGuard from './jwtRefresh.guard';

@Controller('authentication')
@SerializeOptions({
    strategy: 'excludeAll',
})
export class AuthenticationController{
    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly usersService: UsersService,
    ){}
    @Post('register')
    async register(@Body() registrationData: RegisterDto){   
        return this.authenticationService.register(registrationData);
    }     

    @HttpCode(200)
    @UseGuards(LocalAuthenticationGuard)
    @Post('login')
    async login(@Req() request: RequestWithUser){        
        const { user } = request;
        const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(user.id);
        const refreshTokenCookie = this.authenticationService.getCookieWithJwtRefreshToken(user.id);
        await this.usersService.setCurrentRefreshToken(refreshTokenCookie.token, user.id);
        request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie.cookie]);
        return user;
    }
    
    @UseGuards(JwtAuthenticationGuard)
    @Post('logout')
    async logout(@Req() request: RequestWithUser, @Res() response: Response){
        await this.usersService.removeRefreshToken(request.user.id);
        request.res.setHeader('Set-Cookie', [
            'Authentication=; HttpOnly; Path=/; Max-Age=0',
            'Refresh=; HttpOnly; Path=/; Max-Age=0',
        ]);
        return response.sendStatus(200);
    }

    @UseGuards(JwtAuthenticationGuard)
    @Get()
    authenticated(@Req() request: RequestWithUser){
        const user = request.user;
        user.password = undefined;
        return user;
    }

    @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    //Phương thức dưới chỉ được gọi khi refresh token hợp lệ
    async refresh(@Req() request: RequestWithUser){
        const user = request.user;
        const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(user.id);
        request.res.setHeader('Set-Cookie', accessTokenCookie);
        return user;
    }
}