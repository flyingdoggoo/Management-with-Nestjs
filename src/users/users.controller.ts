import { Controller } from '@nestjs/common';
import UsersService from './users.service';
@Controller('users')
export default class UserController {
    constructor(
        private readonly usersService: UsersService,
    ){}
} 