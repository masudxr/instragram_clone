import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'photos' })
export class Photo {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: false })
  description: string;

  @Column()
  like: number;

  @CreateDateColumn()
  dateCreated: Date;

  @ManyToOne(() => User, (user) => user.photos)
  user: User;
}
