import User from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto} from './dto';
@Injectable()
export default class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
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
}