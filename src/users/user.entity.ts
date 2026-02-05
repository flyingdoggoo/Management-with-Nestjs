import { Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}

export default User;