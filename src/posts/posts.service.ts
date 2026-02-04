import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './dto';
import Post from './post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export default class PostsService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
    ) {}
    getAllPosts(){
        return this.postRepository.find();
    }

    async getPostById(id: number){
        const post = await this.postRepository.findOne({ where: { id } });
        if(post){
            return post;
        }
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    async updatePost(id: number, post: UpdatePostDto){
        await this.postRepository.update(id, post);
        const updatedPost = await this.postRepository.findOne({ where: { id } });
        if(updatedPost){
            return updatedPost;
        }
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    async createPost(post: CreatePostDto){
        const newPost = this.postRepository.create(post);
        await this.postRepository.save(newPost);
        return newPost;
    }

    async deletePost(id: number){
        const post = await this.postRepository.findOne({ where: { id } });
        if(post){
            await this.postRepository.remove(post);
        }
        else{
            throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
        }
    }
}
