import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDetail } from 'src/user/dto/userDetail.dto';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('signUp')
  async signUp(
    @Body()
    body: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    },
  ) {
    const userDetail: UserDetail = {
      email: body.email,
      password: body.password,
      firstName: body.firstName,
      lastName: body.lastName,
    };
    const user = await this.userService.createUser(userDetail);

    return this.authService.generateToken(user);
  }

  @Post('logIn')
  async logIn(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    return this.authService.generateToken(user);
  }

  @Post('refreshToken')
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }
}
