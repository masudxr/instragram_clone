import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private readonly _photoRepository: Repository<Photo>,
    @InjectRepository(User) private _userRepository: Repository<User>,
    private _jwtService: JwtService,
    private _usersService: UsersService,
  ) {}

  async create(createPhotoDto: CreatePhotoDto) {
    console.log('DTO:', createPhotoDto);
    const photo = await this._photoRepository.save(createPhotoDto);
    console.log('photos:', photo);
    return photo;
  }

  async photosWithUser(user: any, pro: any) {
    const profile = await this._photoRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        id: pro.id,
      },
    });
    // console.log('new profile details:', profile);
    profile.user = user;
    await this._photoRepository.save(profile);
  }

  async findAll(userID: number) {
    console.log('user Id:', userID);
    const photosDB = await this._photoRepository.find({
      relations: {
        user: true,
      },
    });
    const array = [];
    console.log('photo all:', photosDB[1]);
    for (let i = 0; i < photosDB.length; i++) {
      if (photosDB[i].user.id == userID) {
        console.log('hello !');
        array.push(photosDB[i]);
      }
    }
    console.log('array', array);
    const Arr = [];
    for (let i = 0; i < array.length; i++) {
      const obj = {
        photo_id: array[i].id,
        photo_name: array[i].name,
        photo_like: array[i].like,
        photo_description: array[i].description,
        photo_user_name: array[i].user.name,
      };
      Arr.push(obj);
    }
    return Arr;
  }

  async findOne(id: number) {
    return await this._photoRepository.findOne({
      where: {
        id: id,
      },
    });
  }
  async findOneByName(name: string) {
    return await this._photoRepository.findOne({
      where: {
        name: name,
      },
    });
  }

  async update(id: number, updatePhotoDto: UpdatePhotoDto, user: any) {
    const photo = await this._photoRepository.findOne({
      relations: ['users'],
      where: {
        id: id,
      },
    });
    const Array = photo.users;
    const len = photo.users.length;
    if (len > 0) {
      for (let i = 0; i < len; i++) {
        if (Array[i].name == user.name) {
          photo.users = photo.users.filter((users) => {
            user.name != users.name;
          });
          photo.like = photo.like - 1;
          await this._photoRepository.save(photo);
          return 'failed';
        } else {
          photo.like = photo.like + 1;
          photo.users.push(user);
          await this._photoRepository.save(photo);
          return 'success';
        }
      }
    } else {
      photo.like = photo.like + 1;
      photo.users.push(user);
      await this._photoRepository.save(photo);
      return 'success';
    }
  }

  async remove(id: number) {
    await this._photoRepository.delete(id);
  }

  async reqUser(req: any): Promise<any> {
    const bearer = req.header('authorization');
    bearer.replace('Bearer ', '');
    const parts = bearer.split(' ');
    if (parts.length === 2) {
      const token = parts[1];
      try {
        const ver = await this._jwtService.verifyAsync(token, {
          secret: 'SECRET',
        });
        const user = await this._usersService.findOneByName(ver.username);
        if (user.name == ver.username) {
          return user;
        }
      } catch (error) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: error.message,
          },
          HttpStatus.FORBIDDEN,
          {
            cause: error,
          },
        );
      }
    }
    return false;
  }
}
