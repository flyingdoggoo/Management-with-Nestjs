import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Transform } from 'class-transformer';
import User from '../users/user.entity';
import Category from '../categories/categories.entity';
import { Exclude } from 'class-transformer';
@Entity()
class Post {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    @Exclude()
    public title: string;

    @Column({ nullable: true })
    public content?: string;

    @ManyToOne(() => User, (author: User) => author.posts)
    public author: User;

    @ManyToMany(() => Category, (category) => category.posts, { eager: true })
    @JoinTable()
    //JoinTable thì TypeORM sẽ tạo một bảng trung gian để lưu trữ mối quan hệ many-to-many giữa Post và Category
    public categories: Category[];
}

export default Post;