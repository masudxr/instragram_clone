import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { comparePasswords } from 'src/passwordEncryption/bcrypt';
import { Photo } from 'src/photos/entities/photo.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Photo)
    private readonly _photoRepository: Repository<Photo>,
    private _jwtService: JwtService,
    private _userService: UsersService,
  ) {}
  async userLogin(user: any) {
    if (!user.name || !user.password) {
      throw new UnauthorizedException();
    }
    const userDB = await this._userService.findOneByName(user.name);
    if (userDB) {
      const matched = comparePasswords(user.password, userDB.password);
      if (matched) {
        const payload = { username: userDB.name, sub: userDB.id };
        return {
          access_token: this._jwtService.sign(payload),
        };
      } else {
        throw new NotFoundException();
      }
    } else {
      throw new UnauthorizedException();
    }
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
        const user = await this._userService.findOne(ver.sub);
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

  async findLast10() {
    const photos = await this._photoRepository.find({
      relations: {
        user: true,
      },
    });
    console.log('length', photos.length);
    const len = photos.length - 1;
    const array = [];
    for (let i = len; i >= 0; i--) {
      if (array.length < 10) {
        array.push(photos[i]);
      }
    }
    console.log('array length', array.length);
    return array;
    // const Arr = [];
    // for (let i = 0; i < array.length; i++) {
    // console.log('Array description:', array[i]);
    // const obj = {
    // photo_id: array[i],
    // photo_name: array[i].name,
    // photo_like: array[i].like,
    // photo_description: array[i].description,
    // photo_user_name: array[i].user.name,
    // };
    // console.log('object:', obj);
    // Arr.push(obj);
    // }
    // return Arr;
  }
}
