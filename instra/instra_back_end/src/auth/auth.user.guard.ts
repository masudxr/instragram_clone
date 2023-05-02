import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(
    private _jwtService: JwtService,
    private _userService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const bearer = request.header('authorization');
    bearer.replace('Bearer ', '');
    const parts = bearer.split(' ');
    if (parts.length === 2) {
      const token = parts[1];
      try {
        const ver = await this._jwtService.verifyAsync(token, {
          secret: 'SECRET',
        });
        console.log('verification', ver);
        const user = await this._userService.findOne(ver.sub);
        if (user.name == ver.username) {
          console.log('hello guard !!')
          return true;
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
