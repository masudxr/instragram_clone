import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  phone: number;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  password: string;
}
