import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    content: string;

    @IsString()
    @IsNotEmpty()
    title: string;
}