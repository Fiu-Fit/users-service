import { Page } from '@fiu-fit/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Put,
} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { User } from '@prisma/client';
import { USER_SERVICE_NAME, UserId } from './interfaces/user.pb';
import { UserService } from './user.service';

// @UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod(USER_SERVICE_NAME, 'FindById')
  @Get(':id')
  getUserById(
    data: UserId,
    @Param('id', ParseIntPipe) paramId: number
  ): Promise<User | null> {
    return this.userService.getUserById(data?.id || paramId);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'FindAll')
  @Get()
  getUsers(): Promise<Page<User>> {
    return this.userService.findAndCount();
  }

  @GrpcMethod(USER_SERVICE_NAME, 'Patch')
  @Patch(':id')
  editUser(
    user: User,
    @Body() data: Omit<User, 'id'>,
    @Param('id', ParseIntPipe) paramId: number
  ): Promise<User> {
    return this.userService.editUser(user?.id || paramId, user || data);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'Put')
  @Put(':id')
  putEditUser(
    user: User,
    @Param('id', ParseIntPipe) paramId: number,
    @Body() data: Omit<User, 'id'>
  ): Promise<User> {
    return this.userService.editUser(user?.id || paramId, user || data);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'DeleteById')
  @Delete(':id')
  deleteUser(
    data: UserId,
    @Param('id', ParseIntPipe) paramId: number
  ): Promise<User> {
    return this.userService.deleteUser(data?.id || paramId);
  }
}
