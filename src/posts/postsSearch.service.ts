import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import PostSearchBody from "../posts/types/postSearchBody.interface";
import PostSearchResult from "../posts/types/PostSearchResult.interface";
import PostEntity from "../posts/post.entity";
import { SearchPostDto } from "./dto";

@Injectable()
export default class PostsSearchService {
    index = 'posts';
    constructor(private readonly elasticsearchService: ElasticsearchService) { }
    async indexPost(post: PostEntity) {
        return this.elasticsearchService.index<PostSearchBody>({
            index: this.index,
            id: post.id.toString(),
            body: {
                id: post.id,
                title: post.title,
                content: post.content,
                authorId: post.author.id
            }
        })
    }
    async search(searchDto: SearchPostDto) {
        const must = [];
        if (searchDto.query) {
            must.push({
                multi_match: {
                    query: searchDto.query,
                    fields: ['title', 'content']
                }
            });
        }
        if (searchDto.author) {
            must.push({
                match: {
                    authorId: searchDto.author
                }
            });
        }
        if (searchDto.title) {
            must.push({
                match: {
                    title: searchDto.title
                }
            });
        }
        const result = await this.elasticsearchService.search<PostSearchBody, any>({
            index: this.index,
            query: {
                bool: {
                    must: must
                }
            }
        });
        return result.hits.hits.map(hit => hit._source);
    }
    async remove(postId: number) {
        return this.elasticsearchService.delete({
            index: this.index,
            id: postId.toString()
        });
    }
}

