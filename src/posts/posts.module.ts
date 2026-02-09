import { Module } from '@nestjs/common';
import PostsService from './posts.service';
import PostsController from './posts.controller';
import Post from './post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import PostsSearchService from './postsSearch.service';
import { SearchModule } from 'src/search/search.module';
@Module({
    imports: [TypeOrmModule.forFeature([Post]), SearchModule],
    controllers: [PostsController],
    providers: [PostsService, PostsSearchService],
    exports: [PostsService, PostsSearchService],
})

export class PostsModule {}