import { Page } from '@fiu-fit/common';
import { status } from '@grpc/grpc-js';
import { Body, Controller, Param, ParseIntPipe } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { User } from '@prisma/client';
import { USER_SERVICE_NAME, UserId } from './interfaces/user.pb';
import { UserService } from './user.service';

// @UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod(USER_SERVICE_NAME, 'FindById')
  async getUserById(data: UserId): Promise<User | null> {
    const user = await this.userService.getUserById(data?.id);

    if (!user) {
      throw new RpcException({
        code:    status.NOT_FOUND,
        message: 'User not found',
      });
    }

    return this.userService.getUserById(data?.id);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'FindAll')
  getUsers(): Promise<Page<User>> {
    return this.userService.findAndCount();
  }

  @GrpcMethod(USER_SERVICE_NAME, 'Patch')
  editUser(
    user: User,
    @Body() data: Omit<User, 'id'>,
    @Param('id', ParseIntPipe) paramId: number
  ): Promise<User> {
    return this.userService.editUser(user?.id || paramId, user || data);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'Put')
  putEditUser(user: User): Promise<User> {
    return this.userService.editUser(user?.id, user);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'DeleteById')
  deleteUser(data: UserId): Promise<User> {
    return this.userService.deleteUser(data?.id);
  }
}
