import { Expose } from 'class-transformer';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Address } from './address.entity';
import Post from '../posts/post.entity';
import PublicFile from '../files/publicFile.entity';
@Entity()
class User{
    @PrimaryGeneratedColumn()
    public id: number;

    @Expose()
    @Column({ unique: true })
    public email: string;

    @Expose()
    @Column()
    public name: string;

    @Column()
    public password: string;    

    @OneToOne(() => Address, (address) => address.user, {
        eager: true,
    })
    @JoinColumn()
    public address: Address;

    @OneToMany(() => Post, (post: Post) => post.author)
    public posts: Post[];

    @JoinColumn()
    @OneToOne(() => PublicFile, { eager: true, nullable: true, cascade: true })
    public avatar?: PublicFile;
}
    

export default User;