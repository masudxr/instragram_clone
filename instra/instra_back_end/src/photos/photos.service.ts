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
    // console.log('DTO:', createPhotoDto);
    return await this._photoRepository.save(createPhotoDto);
  }

  async photosWithUser(pro: any) {
    // const userProfile = await this._userRepository.findOne({
    //   where: {
    //     id: user.id,
    //   },
    // });
    // console.log('user inside service :', userProfile);
    // console.log('pro id', pro.id);
    const profile = await this._photoRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        id: pro.id,
      },
    });
    // console.log('new profile details:', profile);
    // profile.user = userProfile;
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
  async findOneByName(id: string) {
    return await this._photoRepository.findOne({
      where: {
        name: id,
      },
    });
  }

  async update(id: number, updatePhotoDto: UpdatePhotoDto) {
    const profile = await this._photoRepository.update(
      { id },
      { ...updatePhotoDto },
    );
    console.log('update profile:', profile);
  }

  async remove(id: number) {
    await this._photoRepository.delete(id);
  }

  async reqUser(req: any) {
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
