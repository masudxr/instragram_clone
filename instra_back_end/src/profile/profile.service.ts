import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Profile } from './entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private _profileRepository: Repository<Profile>,
    @InjectRepository(User) private _userRepository: Repository<User>,
    private _jwtService: JwtService,
    private _usersService: UsersService,
  ) {}

  async create(createProfileDto) {
    const profile = this._profileRepository.create({
      ...createProfileDto,
    });
    console.log(profile);
    return await this._profileRepository.save(profile);
  }

  async findAll() {
    const profile = await this._profileRepository.find();
    return profile;
  }

  async findOne(id: number) {
    const profile = await this._profileRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        id: id,
      },
    });
    return profile;
  }

  async profileWithUser(uid: number, pro: any) {
    const user = await this._userRepository.findOne({
      where: {
        id: uid,
      },
    });
    // console.log('user', user);
    // console.log('pro id', pro.id);
    const profile = await this._profileRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        id: pro.id,
      },
    });
    // console.log('new profile details:', profile);
    profile.user = user;
    await this._profileRepository.save(profile);
  }
  async update(id: number, updateProfileDto: any) {
    const profile = await this._profileRepository.update(
      { id },
      { ...updateProfileDto },
    );
    if (profile) {
      return profile;
    }
    throw new HttpException(
      'Not Updated Please Try agaiin !! ',
      HttpStatus.FORBIDDEN,
    );
  }

  async remove(id: number) {
    await this._profileRepository.delete({ id });
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
          return user.name;
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

  async reqUserPic(req: any) {
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
        console.log('req user;', user);
        const pic = user.profile.name;
        console.log('pic:', pic);
        return pic;
        // if (user.name == ver.username) {
        //   return user;
        // }
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
  async updateReqUser(req: any) {
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
        console.log('update req user:', user);
        const picId = user.profile.id;
        console.log('pic id', picId);
        if (user.name == ver.username && ver.sub == user.id) {
          return picId;
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
