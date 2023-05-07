import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { AdminGuard } from './admin.guard';
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
    if (body.role === Role.Admin)
      throw new UnauthorizedException({
        message: 'Use /admin/register to register an admin',
      });
    return this.authService.register(newUser || body);
  }

  @Post('login')
  login(
    loginInfo: LoginRequest,
    @Body() body: LoginRequest
  ): Promise<{ token: string }> {
    return this.authService.login(loginInfo || body);
  }

  @UseGuards(AdminGuard)
  @Post('admin/register')
  adminRegister(
    newUser: RegisterRequest,
    @Body() body: RegisterRequest
  ): Promise<{ token: string }> {
    return this.authService.register(newUser || body);
  }

  @Post('admin/login')
  adminLogin(
    loginInfo: LoginRequest,
    @Body() body: LoginRequest
  ): Promise<{ token: string }> {
    return this.authService.adminLogin(loginInfo || body);
  }

  @Post('logout')
  logout() {
    return this.authService.logout();
  }

  @Post('validate')
  async validate(@Body() request: Token): Promise<User> {
    const user = await this.authService.validateUserByToken(request.token);

    if (!user)
      throw new UnauthorizedException({ message: 'The token is invalid' });

    return user;
  }
}
