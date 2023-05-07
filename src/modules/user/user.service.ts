import { Page } from '@fiu-fit/common';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { firebaseAdmin } from '../../firebase/firebase';
import { PrismaService } from '../../prisma.service';
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
        role: user.role,
      },
    });
  }

  async searchUsers(query: string): Promise<User[]> {
    const users = await this.prismaService.user.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
    });

    return users;
  }

  async deleteUser(id: number): Promise<User> {
    const user = await this.prismaService.user
      .delete({
        where: {
          id,
        },
      })
      .catch(_ => {
        throw new NotFoundException({ message: 'User not found' });
      });

    if (!user) {
      throw new NotFoundException({ message: 'User not found' });
    }

    await firebaseAdmin.auth().deleteUser(user.uid);

    return user;
  }
}
