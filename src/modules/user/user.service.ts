import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { UserData } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  getUsers(): Promise<User[]> {
    return this.prismaService.user.findMany({
      orderBy: { id: 'asc' },
    });
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

  editUser(id: number, user: Omit<UserData, 'id'>): Promise<User> {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: user,
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
