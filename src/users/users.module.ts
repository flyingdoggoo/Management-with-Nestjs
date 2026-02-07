import { Module } from '@nestjs/common';
import UsersService from './users.service';
import UserController from './users.controller';
import User from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from 'src/files/files.module';
@Module({
    //Đăng ký entity User với TypeOrmModule
    //Giúp UsersService có thể sử dụng Repository của User để thao tác với cơ sở dữ liệu
    imports: [TypeOrmModule.forFeature([User]), FilesModule],
    controllers: [UserController],
    providers: [UsersService],
    exports: [UsersService],
})

export class UsersModule {}