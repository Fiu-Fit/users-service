import {
  Body,
  Controller,
  Headers,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AdminGuard } from './admin.guard';
import { AuthService } from './auth.service';
import { AdminRegisterRequest, LoginRequest, RegisterRequest } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() newUser: RegisterRequest): Promise<{ token: string }> {
    if (newUser.role === Role.Admin)
      throw new UnauthorizedException({
        message: 'Use /admin/register to register an admin',
      });
    return this.authService.register(newUser);
  }

  @Post('login')
  login(@Body() loginInfo: LoginRequest): Promise<{ token: string }> {
    return this.authService.login(loginInfo);
  }

  @UseGuards(AdminGuard)
  @Post('admin/register')
  adminRegister(
    @Body() newUser: AdminRegisterRequest
  ): Promise<{ token: string }> {
    const registerRequest: RegisterRequest = {
      ...newUser,
      bodyWeight: -1,
      role:       Role.Admin,
    };

    return this.authService.register(registerRequest);
  }

  @Post('admin/login')
  adminLogin(@Body() loginInfo: LoginRequest): Promise<{ token: string }> {
    return this.authService.adminLogin(loginInfo);
  }

  @Post('logout')
  logout() {
    return this.authService.logout();
  }

  @Post('password-reset')
  passwordReset(@Headers('Authorization') bearerToken: string) {
    return this.authService.addPasswordReset(bearerToken);
  }
}
