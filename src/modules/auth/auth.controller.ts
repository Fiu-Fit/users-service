import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { ClientGrpc, GrpcMethod } from '@nestjs/microservices';
import { NotFoundException } from '../../shared/rpc-exceptions/NotFoundException';
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
  constructor(
    private readonly authService: AuthService,
    @Inject('AUTH_PACKAGE') private readonly client: ClientGrpc
  ) {}

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
  @Post('validate')
  async validate(request: Token): Promise<ValidResponse> {
    const user = await this.authService.validateUserByToken(request.token);

    if (!user) throw new NotFoundException('User not found');

    return { status: HttpStatus.OK, errors: [], userId: user.id };
  }
}
