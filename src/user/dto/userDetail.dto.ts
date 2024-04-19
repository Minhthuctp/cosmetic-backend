import { IsNotEmpty, IsEmail } from 'class-validator';
export class UserDetail {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  hashPassword: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;
}
