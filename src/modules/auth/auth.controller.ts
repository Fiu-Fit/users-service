import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { UserDto } from '../user/user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth-guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUpUser(@Body() user: UserDto): Promise<{ token: string }> {
    return this.authService.signUpUser(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  loginUser(@Req() req: Request): { token: string } {
    return this.authService.loginUser(req.user as User);
  }
}
