import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  BadRequestException,
  NotFoundException,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Observable, of } from 'rxjs';
import { join } from 'path';
import { UserAuthGuard } from 'src/auth/auth.user.guard';
import { ProfileService } from 'src/profile/profile.service';

const storage = {
  storage: diskStorage({
    destination: './uploads/profile',
    filename: (req, file, cb) => {
      cb(null, `${file.originalname}`);
    },
  }),
};

@Controller('users')
export class UsersController {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _profileService: ProfileService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storage))
  async uploadfile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return file;
  }
  @Get('pro/:picName')
  proPicture(@Param('picName') picName, @Res() res): Observable<object> {
    console.log('res:', res);
    return of(res.sendFile(join(process.cwd(), 'uploads/profile/' + picName)));
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    console.log('hello User');
    console.log(createUserDto);
    const user = await this._usersService.create(createUserDto);
    console.log('user controller', user);
    if (!user) {
      throw new BadRequestException();
    }
    const obj = {
      name: 'profile.png',
    };
    const pro = await this._profileService.create(obj);
    await this._profileService.profileWithUser(user.id, pro);

    return user;
  }

  @Get()
  async findAll() {
    const users = await this._usersService.findAll();
    if (!users) {
      throw new NotFoundException();
    }
    return users;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this._usersService.findOne(+id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Get('profile/:name')
  async prfile(@Param('name') name: string) {
    const user = await this._usersService.findProfile(name);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @UseGuards(UserAuthGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    console.log('Update bio');
    return await this._usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: number) {
    const checkUser = await this._usersService.reqUser(req, id);
    if (checkUser) {
      return await this._usersService.remove(+id);
    }
  }

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file', storage))
  // uploadFile(@UploadedFile() file): Observable<object> {
  //   console.log(file);
  //   return of({ imagePath: file.filename });
  // }
}
