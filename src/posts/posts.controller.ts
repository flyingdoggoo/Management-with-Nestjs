import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import PostsService from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto';
import { JwtAuthenticationGuard } from 'src/authentication/jwtAuthentication.guard';

@Controller('posts')
export default class PostsController {
    constructor(
        private readonly postsService: PostsService,
    ) {}

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    getAllPosts() {
        return this.postsService.getAllPosts();
    }

    @Get(':id')
    getPostById(@Param('id') id: string) {
        return this.postsService.getPostById(Number(id));
    }

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    async createPost(@Body() createPostDto : CreatePostDto) {
        return this.postsService.createPost(createPostDto);
    }

    @Put(':id')
    async updatePost(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
        return this.postsService.updatePost(Number(id), updatePostDto);
    }

    @Delete(':id')
    async deletePost(@Param('id') id: string) {
        return this.postsService.deletePost(Number(id));
    }
}
