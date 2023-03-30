import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException({
        message: 'Usuario con el id proveido no fue encontrado',
      });
    }
    return user;
  }

  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }
}
