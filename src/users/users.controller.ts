import { Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';import UsersService from './users.service';
import { JwtAuthenticationGuard } from 'src/authentication/jwtAuthentication.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import type RequestWithUser from 'src/authentication/interface/requestWithUser.interface';
@Controller('users')
export default class UserController {
    constructor(
        private readonly usersService: UsersService,
    ){}

    @Post('avatar')
    @UseGuards(JwtAuthenticationGuard)
    @UseInterceptors(FileInterceptor('file'))
    async addAvatar(@Req() req: RequestWithUser, @UploadedFile() file: Express.Multer.File) {
        return this.usersService.addAvatar(req.user.id, file.buffer, file.originalname);
    }

    @Get()
    async getAllUsers(){
        return this.usersService.getAllUsers();
    }
} 