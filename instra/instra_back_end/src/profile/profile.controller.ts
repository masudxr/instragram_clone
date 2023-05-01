import {
  Controller,
  Get,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { of } from 'rxjs';
import { UserAuthGuard } from 'src/auth/auth.user.guard';
import { UsersService } from 'src/users/users.service';

const storage = {
  storage: diskStorage({
    destination: './uploads/profile',
    filename: (req, file, cb) => {
      cb(null, `${file.originalname}`);
    },
  }),
};

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly _profileService: ProfileService,
    private readonly _usersService: UsersService,
  ) {}

  @Post()
  @UseGuards(UserAuthGuard)
  @UseInterceptors(FileInterceptor('file', storage))
  async uploadfile(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const checkUser = await this._profileService.reqUser(req);
    const user = String(checkUser);
    const users = await this._usersService.findOneByName(user);

    if (checkUser) {
      const obj = {
        name: file.filename,
      };
      const pro = await this._profileService.create(obj);
      await this._profileService.profileWithUser(users.id, pro);
      console.log('updated DB Successfully!');
      return file;
    }
  }

  @Get()
  @UseGuards(UserAuthGuard)
  async proPicture(@Req() req, @Res() res) {
    const user = await this._profileService.reqUserPic(req);
    console.log('user DATA:', user);
    return of(res.sendFile(join(process.cwd(), 'uploads/profile/' + user)));
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file', storage))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
  ) {
    console.log('new uploaded file name:', file.filename);
    const obj = {
      name: file.filename,
    };
    const fun = await this._profileService.update(+id, obj);
    if (fun) {
      console.log('updated DB Successfully!');
      return file;
    }
  }
  // join profile and user column
  // @Post('list')
  // async profileWithUser() {
  //   return await this._profileService.profileWithUser(8, 1);
  // }

  // @Delete()
  // async remove(@Req() req) {
  //   const user = await this._profileService.updateReqUser(req);
  //   console.log('delete user', user);
  //   return this._profileService.remove(+user);
  // }
}
