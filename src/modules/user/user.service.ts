import { Page } from '@fiu-fit/common';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { firebaseAdmin } from '../../firebase/firebase';
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

  async deleteUser(id: number): Promise<User> {
    const user = await this.prismaService.user
      .findUnique({
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
