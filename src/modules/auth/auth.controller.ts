import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UnauthorizedException } from '../../shared/rpc-exceptions';
import { AuthService } from './auth.service';
import {
  AUTH_SERVICE_NAME,
  LoginRequest,
  RegisterRequest,
  Token,
  ValidResponse,
} from './interfaces/auth.pb';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod(AUTH_SERVICE_NAME)
  @Post('register')
  register(
    newUser: RegisterRequest,
    @Body() body: RegisterRequest
  ): Promise<{ token: string }> {
    return this.authService.register(newUser || body);
  }

  @GrpcMethod(AUTH_SERVICE_NAME)
  @Post('login')
  login(
    loginInfo: LoginRequest,
    @Body() body: LoginRequest
  ): Promise<{ token: string }> {
    return this.authService.login(loginInfo || body);
  }

  @GrpcMethod(AUTH_SERVICE_NAME)
  @Post('logout')
  logout() {
    return this.authService.logout();
  }

  @GrpcMethod(AUTH_SERVICE_NAME)
  @Post('validate')
  async validate(request: Token): Promise<ValidResponse> {
    const user = await this.authService.validateUserByToken(request.token);

    if (!user) throw new UnauthorizedException('The token is invalid');

    return { status: HttpStatus.OK, errors: [], userId: user.id };
  }
}
