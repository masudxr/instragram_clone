import { Photo } from 'src/photos/entities/photo.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  phone: number;

  @Column({ nullable: false })
  address: string;

  @Column({ nullable: false })
  password: string;

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];

  @OneToOne(() => Profile, (profile) => profile.user)
  @JoinColumn()
  profile: Profile;

  @ManyToMany(() => Photo, (photo) => photo.users)
  photo: Photo[];
}
