import {
  Controller,
  Inject,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ClientGrpc, GrpcMethod } from '@nestjs/microservices';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { UserData, UserId } from './interfaces/user.interface';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject('USER_PACKAGE') private readonly client: ClientGrpc
  ) {}

  @GrpcMethod('UsersService', 'FindById')
  getUserById({ id }: UserId): Promise<User | null> {
    return this.userService.getUserById(id);
  }

  @GrpcMethod('UsersService', 'FindAll')
  getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @GrpcMethod('UsersService', 'Patch')
  editUser(user: UserData): Promise<User> {
    const { id, ...rest } = user;
    return this.userService.editUser(id, rest);
  }

  @GrpcMethod('UsersService', 'Put')
  putEditUser(user: UserData): Promise<User> {
    const { id, ...rest } = user;
    return this.userService.editUser(id, rest);
  }

  @GrpcMethod('UsersService', 'DeleteById')
  deleteUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.deleteUser(id);
  }
}
