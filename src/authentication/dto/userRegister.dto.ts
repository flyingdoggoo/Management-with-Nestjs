import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';
export class RegisterDto {
    @IsEmail()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string;
}
