import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginRequest,
  RegisterRequest,
  Token,
} from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    newUser: RegisterRequest,
    @Body() body: RegisterRequest
  ): Promise<{ token: string }> {
    return this.authService.register(newUser || body);
  }

  @Post('login')
  login(
    loginInfo: LoginRequest,
    @Body() body: LoginRequest
  ): Promise<{ token: string }> {
    return this.authService.login(loginInfo || body);
  }

  @Post('logout')
  logout() {
    return this.authService.logout();
  }

  @Post('validate')
  async validate(@Body() request: Token): Promise<number> {
    const user = await this.authService.validateUserByToken(request.token);

    if (!user)
      throw new UnauthorizedException({ message: 'The token is invalid' });

    return user.id;
  }
}
