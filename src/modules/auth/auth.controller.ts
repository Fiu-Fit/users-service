import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginRequest,
  RegisterRequest,
  Token,
  ValidResponse,
} from './interfaces/auth.pb';

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
  async validate(request: Token): Promise<ValidResponse> {
    const user = await this.authService.validateUserByToken(request.token);

    if (!user)
      throw new UnauthorizedException({ message: 'The token is invalid' });

    return { status: HttpStatus.OK, errors: [], userId: user.id };
  }
}
