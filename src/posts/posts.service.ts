import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreatePostDto, SearchPostDto, UpdatePostDto } from './dto';
import Post from './post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from '../users/user.entity';
import PostsSearchService from './postsSearch.service';
@Injectable()
export default class PostsService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        private readonly postsSearchService: PostsSearchService,
    ) {}
    getAllPosts(){
        return this.postRepository.find({ relations: ['author'] });
    }

    async getPostById(id: number){
        const post = await this.postRepository.findOne({ where: { id }, relations: ['author'] });
        if(post){
            return post;
        }
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    async updatePost(id: number, post: UpdatePostDto){
        await this.postRepository.update(id, post);
        const updatedPost = await this.postRepository.findOne({ where: { id }, relations: ['author'] });
        if(updatedPost){
            await this.postsSearchService.indexPost(updatedPost);
            return updatedPost;
        }
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    
    async createPost(post: CreatePostDto, user: User){
        const newPost = this.postRepository.create({ ...post, author: user });
        await this.postRepository.save(newPost);
        await this.postsSearchService.indexPost(newPost);
        return newPost;
    }

    async deletePost(id: number){
        const deleteResponse = await this.postRepository.delete(id);
        if(deleteResponse.affected === 0){
            throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
        }
        await this.postsSearchService.remove(id);
        return deleteResponse;
    }

    async searchPosts(searchDto: SearchPostDto){
        return this.postsSearchService.search(searchDto);
    }
}
