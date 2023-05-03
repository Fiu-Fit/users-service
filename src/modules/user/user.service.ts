import { Page } from '@fiu-fit/common';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { RoleTransformer } from '../../shared/RoleTransformer';
import { UserDTO } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findAndCount(): Promise<Page<User>> {
    return {
      rows: await this.prismaService.user.findMany({
        orderBy: { id: 'asc' },
      }),
      count: await this.prismaService.user.count(),
    };
  }

  getUserById(id: number): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  getUserByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  editUser(id: number, user: UserDTO): Promise<User> {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...user,
        role: RoleTransformer(user.role),
      },
    });
  }

  deleteUser(id: number): Promise<User> {
    return this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }
}
