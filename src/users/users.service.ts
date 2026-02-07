import User from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto} from './dto';
import { FilesService } from '../files/files.service';
@Injectable()
export default class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly filesService: FilesService,
    ) {}

    async getByEmail(email: string){
        const user = await this.userRepository.findOne({ where: { email } });
        if(user){
            return user;
        }
        throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
    }

    async createUser(userData: CreateUserDto){
        const newUser = this.userRepository.create(userData);
        await this.userRepository.save(newUser);
        return newUser;
    }

    async updateUser(id: number, userData: UpdateUserDto){
        await this.userRepository.update(id, userData);
        const updatedUser = this.userRepository.findOne({ where: { id } });
        if(updatedUser){
            return updatedUser;
        }
    }

    async getById(id: number){
        const user = await this.userRepository.findOne({ where: { id } });
        if(user){
            return user;
        }
        throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
    }

    async addAvatar(userId: number, imageBuffer: Buffer, filename: string){
        const user = await this.getById(userId);
        if(user.avatar){
            await this.userRepository.update(userId, {
                ...user,
                avatar: null,
            });
            await this.filesService.deletePublicFile(user.avatar.id);
        }
        const avatar =  await this.filesService.uploadPublicFile(imageBuffer, filename);
        await this.userRepository.update(userId, {
            ...user,
            avatar: avatar,
        });
        return avatar;
    }

    async deleteAvatar(userId: number){
        const user =  await this.getById(userId);
        if(user.avatar){
            await this.userRepository.update(userId, {
                ...user,
                avatar: null,
            });
            await this.filesService.deletePublicFile(user.avatar.id);
        }
    }

    async getAllUsers(){
        return this.userRepository.find();
    }
}