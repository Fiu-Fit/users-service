import { Controller, Inject } from '@nestjs/common';
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
  register(newUser: RegisterRequest): Promise<{ token: string }> {
    return this.authService.register(newUser);
  }

  @GrpcMethod('AuthService', 'login')
  login(loginInfo: LoginRequest): Promise<{ token: string }> {
    return this.authService.login(loginInfo);
  }
}
