import { Page } from '@fiu-fit/common';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { User } from '@prisma/client';
import { NotFoundException } from '../../shared/rpc-exceptions/NotFoundException';
import { USER_SERVICE_NAME, UserId } from './interfaces/user.pb';
import { UserDTO } from './user.dto';
import { UserService } from './user.service';

// @UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod(USER_SERVICE_NAME, 'FindById')
  async getUserById(data: UserId): Promise<User | null> {
    const user = await this.userService.getUserById(data?.id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userService.getUserById(data?.id);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'FindAll')
  getUsers(): Promise<Page<User>> {
    return this.userService.findAndCount();
  }

  @GrpcMethod(USER_SERVICE_NAME, 'Put')
  async putEditUser(user: UserDTO): Promise<User> {
    const editedUser = await this.userService.editUser(user?.id, user);

    if (!editedUser) {
      throw new NotFoundException('User not found');
    }

    return editedUser;
  }

  @GrpcMethod(USER_SERVICE_NAME, 'DeleteById')
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
