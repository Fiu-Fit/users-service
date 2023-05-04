import { Page } from '@fiu-fit/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserDTO } from './user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<User | null> {
    const user = await this.userService.getUserById(id);

    if (!user) {
      throw new NotFoundException({ message: 'User not found' });
    }

    return user;
  }

  @Get()
  getUsers(): Promise<Page<User>> {
    return this.userService.findAndCount();
  }

  @Put(':id')
  async putEditUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UserDTO
  ): Promise<User> {
    const editedUser = await this.userService.editUser(id, user);

    if (!editedUser) {
      throw new NotFoundException({ message: 'User not found' });
    }

    return editedUser;
  }

  @Delete(':id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number
  ): Promise<User | undefined> {
    try {
      return await this.userService.deleteUser(id);
    } catch (e) {
      if ((e as any)?.code === 'P2025') {
        throw new NotFoundException({ message: 'User not found' });
      }
      throw e;
    }
  }
}
