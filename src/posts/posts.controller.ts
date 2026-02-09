import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, UseInterceptors, Query } from '@nestjs/common';
import PostsService from './posts.service';
import { CreatePostDto, UpdatePostDto, SearchPostDto } from './dto';
import { JwtAuthenticationGuard } from 'src/authentication/jwtAuthentication.guard';
import { FindOneParams } from 'src/ultis/findOneParams';
import { ExcludeNullInterceptor } from 'src/ultis/excludeNull.interceptor';
import type RequestWithUser from 'src/authentication/interface/requestWithUser.interface';

@Controller('posts')
// @UseInterceptors(ExcludeNullInterceptor)
export default class PostsController {
    constructor(
        private readonly postsService: PostsService,
    ) {}

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    getAllPosts() {
        return this.postsService.getAllPosts();
    }
    @Get('search')
    @UseGuards(JwtAuthenticationGuard)
    searchPosts(@Query() dto: SearchPostDto) {
        return this.postsService.searchPosts(dto);
    }
    @Get(':id')
    getPostById(@Param() { id }: FindOneParams) {
        return this.postsService.getPostById(Number(id));
    }

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    async createPost(@Body() createPostDto : CreatePostDto, @Req() req: RequestWithUser) {
        return this.postsService.createPost(createPostDto, req.user);
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
