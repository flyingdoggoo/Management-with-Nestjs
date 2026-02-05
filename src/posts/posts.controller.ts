import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import PostsService from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto';
import { JwtAuthenticationGuard } from 'src/authentication/jwtAuthentication.guard';
import { FindOneParams } from 'src/ultis/findOneParams';
import { ExcludeNullInterceptor } from 'src/ultis/excludeNull.interceptor';

@Controller('posts')
@UseInterceptors(ExcludeNullInterceptor)
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
    getPostById(@Param() { id }: FindOneParams) {
        return this.postsService.getPostById(Number(id));
    }

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    async createPost(@Body() createPostDto : CreatePostDto) {
        return this.postsService.createPost(createPostDto);
    }

    @Put(':id')
    async updatePost(@Param() { id }: FindOneParams, @Body() updatePostDto: UpdatePostDto) {
        return this.postsService.updatePost(Number(id), updatePostDto);
    }

    @Delete(':id')
    async deletePost(@Param() { id }: FindOneParams) {
        return this.postsService.deletePost(Number(id));
    }
}
