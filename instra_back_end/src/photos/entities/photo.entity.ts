import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinTable,
  ManyToMany,
} from 'typeorm';

@Entity({ name: 'photos' })
export class Photo {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: true })
  like: number;

  @CreateDateColumn()
  dateCreated: Date;

  @ManyToOne(() => User, (user) => user.photos)
  user: User;

  @ManyToMany(() => User, (user) => user.photo)
  @JoinTable()
  users: User[];
}
