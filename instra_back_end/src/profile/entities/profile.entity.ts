import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';

@Entity('profile')
export class Profile {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: false })
  name: string;

  @CreateDateColumn()
  uploadedDate: Date;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
