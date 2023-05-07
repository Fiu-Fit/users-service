import { Page } from '@fiu-fit/common';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { firebaseAdmin } from '../../firebase/firebase';
import { PrismaService } from '../../prisma.service';
import { GetUsersQueryDTO, UserDTO } from './dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findAndCount(filter: GetUsersQueryDTO): Promise<Page<User>> {
    const rows = await this.prismaService.user.findMany({
      orderBy: { id: 'asc' },
      where:   {
        id: {
          in: filter.ids,
        },
      },
    });

    return {
      rows:  rows,
      count: rows.length,
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
