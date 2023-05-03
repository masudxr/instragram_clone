import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
// import { encodePassword } from 'src/passwordEncryption/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { encodePassword } from 'src/passwordEncryption/bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private _userRepository: Repository<User>,
    private _jwtService: JwtService,
  ) {}
  async create(userDetails: CreateUserDto) {
    const password = encodePassword(userDetails.password);
    const newUser = this._userRepository.create({
      ...userDetails,
      password,
    });
    const admin = await this._userRepository.save(newUser);
    const obj = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
    };
    return obj;
  }
  async findAll() {
    const admin = await this._userRepository.find();
    // const array = [];
    // for (let i = 0; i < admin.length; i++) {
    //   const obj = {
    //     id: admin[i].id,
    //     name: admin[i].name,
    //     email: admin[i].email,
    //     phone: admin[i].phone,
    //     address: admin[i].address,
    //   };
    //   array.push(obj);
    // }
    return admin;
  }

  async findOne(id: number) {
    const admin = await this._userRepository.findOne({
      relations: ['profile'],
      where: {
        id: id,
      },
    });
    // console.log('users:', admin);
    if (!admin) {
      return null;
    }
    const obj = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      pic: admin.profile.name,
      address: admin.address,
      password: admin.password,
    };
    return obj;
  }
  async findOneByName(name: string) {
    const admin = await this._userRepository.findOne({
      relations: ['profile'],
      where: {
        name: name,
      },
    });
    return admin;
  }

  async findProfile(name: string) {
    const admin = await this._userRepository.findOne({
      relations: ['profile'],
      where: {
        name: name,
      },
    });
    return admin;
  }
  async update(id: number, updateUserDetails: UpdateUserDto) {
    const user = await this._userRepository.update(
      { id },
      { ...updateUserDetails },
    );
    if (user) {
      return user;
    }
    throw new HttpException(
      'Not Updated Please Try agaiin !! ',
      HttpStatus.FORBIDDEN,
    );
  }

  async remove(id: number) {
    await this._userRepository.delete({ id });
  }

  async reqUser(req: any, id: number) {
    const bearer = req.header('authorization');
    bearer.replace('Bearer ', '');
    const parts = bearer.split(' ');
    if (parts.length === 2) {
      const token = parts[1];
      try {
        const ver = await this._jwtService.verifyAsync(token, {
          secret: 'SECRET',
        });
        const user = await this._userRepository.findOne({
          where: {
            id: ver.sub,
          },
        });
        if (user.name == ver.username && ver.sub == id) {
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
