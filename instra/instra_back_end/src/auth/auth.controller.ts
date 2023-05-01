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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAuthGuard } from './auth.user.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('login')
  async userLogin(@Body() req) {
    const user = await this._authService.userLogin(req);
    console.log('user token:', user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
  @UseGuards(UserAuthGuard)
  @Get('profile')
  async getUser(@Req() req) {
    const user = await this._authService.reqUser(req);
    console.log('user:', user);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
  @Get()
  async findLast10() {
    const userPhoto = await this._authService.findLast10();
    return userPhoto;
  }
}
