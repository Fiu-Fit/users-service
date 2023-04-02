import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientGrpc, GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginRequest, RegisterRequest } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('AUTH_PACKAGE') private readonly client: ClientGrpc
  ) {}

  @GrpcMethod('AuthService', 'Register')
  @Post('register')
  register(
    newUser: RegisterRequest,
    @Body() body: RegisterRequest
  ): Promise<{ token: string }> {
    return this.authService.register(newUser || body);
  }

  @GrpcMethod('AuthService', 'login')
  @Post('login')
  login(
    loginInfo: LoginRequest,
    @Body() body: LoginRequest
  ): Promise<{ token: string }> {
    return this.authService.login(loginInfo || body);
  }
}
