import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UploadedFile,
  UseInterceptors,
  // Res,
  UseGuards,
  Put,
  // BadRequestException,
} from '@nestjs/common';
import { PhotosService } from './photos.service';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from 'src/users/users.service';
// import { join } from 'path';
// import { of } from 'rxjs';
import { UserAuthGuard } from 'src/auth/auth.user.guard';
import { UpdatePhotoDto } from './dto/update-photo.dto';

const storage = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      cb(null, `${file.originalname}`);
    },
  }),
};

@Controller('photos')
export class PhotosController {
  constructor(
    private readonly _photosService: PhotosService,
    private readonly _usersService: UsersService,
  ) {}

  @Post()
  // @UseGuards(UserAuthGuard)
  @UseInterceptors(FileInterceptor('file', storage))
  async uploadfile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
    @Body() body,
  ) {
    body.name = file.originalname;
    body.like = 0;
    // const checkUser = await this._photosService.reqUser(req);
    // if (checkUser) {
    const photos = await this._photosService.create(body);
    await this._photosService.photosWithUser(photos);
    return photos;
    // }
    // throw new BadRequestException();
  }

  // @Get(':picName')
  // @UseGuards(UserAuthGuard)
  // async proPicture(@Param('picName') picName: string, @Req() req, @Res() res) {
  //   console.log('pic name:', picName);
  //   console.log('Hello Masud!!')
  //   const user = await this._photosService.reqUser(req);
  //   const photo = await this._photosService.findOneByName(picName);
  //   console.log('photo:', photo);
  //   if (user && photo) {
  //     return of(res.sendFile(join(process.cwd(), 'uploads/' + picName)));
  //   }
  //   throw new BadRequestException();
  // }
  @UseGuards(UserAuthGuard)
  @Get('user')
  async findAll(@Req() req) {
    console.log('hello !!');
    console.log('request photos', req.headers.authorization);
    const user = await this._photosService.reqUser(req);
    console.log('user Photos ', user.id);
    if (user) {
      const userPhoto = await this._photosService.findAll(user.id);
      return userPhoto;
    }
  }

  @UseGuards(UserAuthGuard)
  @Get('uploaded/:id')
  async UsersUploadedPhotos(@Param('id') id: number) {
    console.log('Hello Bondu!');
    const userPhoto = await this._photosService.findAll(id);
    return userPhoto;
  }

  // @Put('increase/:id')
  // async increaseLike(@Param('id') id: number) {
  //   console.log('id', id);
  //   const photo = await this._photosService.findOne(id);
  //   console.log('photo:', photo.id);
  //   console.log('photo like:', photo.like);
  //   const count = 1;
  //   const newValue = photo.like + count;
  //   console.log('updated like:', newValue);
  //   const obj = {
  //     like: newValue,
  //   };
  //   return await this._photosService.update(photo.id, obj);
  // }
  // @Put('decrease/:id')
  // async decreaseLike(@Param('id') id: number) {
  //   const photo = await this._photosService.findOne(id);
  //   console.log('photo:', photo.id);
  //   console.log('photo like:', photo.like);
  //   const count = -1;
  //   const newValue = photo.like + count;
  //   console.log('updated like:', newValue);
  //   photo.like = newValue;
  //   const obj = {
  //     like: newValue,
  //   };
  //   return await this._photosService.update(photo.id, obj);
  // }

  @Delete(':picname')
  async remove(@Req() req, @Param('picname') picname: number) {
    const user = await this._photosService.reqUser(req);
    const photo = await this._photosService.findOne(picname);
    console.log('photo:', photo.id);
    if (user && photo) {
      return await this._photosService.remove(photo.id);
    }
  }
  // Handle Likes
  @UseGuards(UserAuthGuard)
  @Put(':id')
  async update(
    @Req() req,
    @Param('id') id: number,
    @Body() updatePhotoDto: UpdatePhotoDto,
  ) {
    // console.log('update like');
    // console.log('Update info', updatePhotoDto);
    // console.log('get id from frontend:', id);
    const user = await this._photosService.reqUser(req);
    return await this._photosService.update(id, updatePhotoDto, user);
  }
}
