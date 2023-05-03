import {
  Controller,
  Post,
  // UseGuards,
  Get,
  Body,
  Req,
  UnauthorizedException,
  NotFoundException,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAuthGuard } from './auth.user.guard';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private _jwtService: JwtService,
    private readonly _usersService: UsersService,
  ) {}

  @Post('login')
  async userLogin(@Body() req) {
    console.log('req from frontend', req);
    const token = await this._authService.userLogin(req);
    console.log('user token:', token);
    if (!token) {
      throw new UnauthorizedException();
    }
    return {
      token: token,
    };
  }
  @UseGuards(UserAuthGuard)
  @Get('profile')
  async getUser(@Req() req) {
    console.log('request', req.headers.authorization);
    const user = await this._authService.reqUser(req);
    console.log('user:', user);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
  // @Get('profile')
  // async getUser(@Req() req: Request) {
  //   // try {
  //   const cookie = req.cookies['user'];
  //   console.log('cokkei', cookie);
  //   const data = await this._jwtService.verifyAsync(cookie);
  //   console.log('data', data);
  //   if (!data) {
  //     throw new UnauthorizedException();
  //   }
  //   const user = await this._usersService.findOne(data.sub);
  //   console.log('user', user);
  //   user.password = undefined;

  // return user;
  // } catch (e) {
  //   throw new UnauthorizedException();
  // }
  // }
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('user');
    return {
      message: 'success',
    };
  }

  @Get()
  async findLast10() {
    const userPhoto = await this._authService.findLast10();
    return userPhoto;
  }
}
