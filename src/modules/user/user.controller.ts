import { Page } from '@fiu-fit/common';
import { Controller, Delete, Get, Put } from '@nestjs/common';
import { User } from '@prisma/client';
import { NotFoundException } from '../../shared/rpc-exceptions';
import { UserId } from './interfaces/user.pb';
import { UserDTO } from './user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserById(data: UserId): Promise<User | null> {
    const user = await this.userService.getUserById(data?.id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userService.getUserById(data?.id);
  }

  @Get()
  getUsers(): Promise<Page<User>> {
    return this.userService.findAndCount();
  }

  @Put(':id')
  async putEditUser(user: UserDTO): Promise<User> {
    const editedUser = await this.userService.editUser(user?.id, user);

    if (!editedUser) {
      throw new NotFoundException('User not found');
    }

    return editedUser;
  }

  @Delete(':id')
  async deleteUser(data: UserId): Promise<User | undefined> {
    try {
      return await this.userService.deleteUser(data?.id);
    } catch (e) {
      if ((e as any)?.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw e;
    }
  }
}
