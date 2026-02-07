import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ManyToMany } from 'typeorm';
import Post from '../posts/post.entity';
@Entity()
export default class Category {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @ManyToMany(() => Post, (post) => post.categories)
    public posts: Post[];
}

