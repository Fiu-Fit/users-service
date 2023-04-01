import {
  Body,
  Controller, Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  UseGuards
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
  @Get(':id')
  getUserById(
    data: UserId,
    @Param('id', ParseIntPipe) paramId: number
  ): Promise<User | null> {
    return this.userService.getUserById(data?.id || paramId);
  }

  @GrpcMethod('UsersService', 'FindAll')
  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @GrpcMethod('UsersService', 'Patch')
  @Patch(':id')
  editUser(
    user: UserData,
    @Body() data: Omit<UserData, 'id'>,
    @Param('id', ParseIntPipe) paramId: number
  ): Promise<User> {
    return this.userService.editUser(user?.id || paramId, user || data);
  }

  @GrpcMethod('UsersService', 'Put')
  @Put(':id')
  putEditUser(
    user: UserData,
    @Param('id', ParseIntPipe) paramId: number,
    @Body() data: Omit<UserData, 'id'>
  ): Promise<User> {
    return this.userService.editUser(user?.id || paramId, user || data);
  }

  @GrpcMethod('UsersService', 'DeleteById')
  @Delete(':id')
  deleteUser(
    data: UserId,
    @Param('id', ParseIntPipe) paramId: number
  ): Promise<User> {
    return this.userService.deleteUser(data?.id || paramId);
  }
}
