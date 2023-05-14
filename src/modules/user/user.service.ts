import { Page } from '@fiu-fit/common';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as admin from 'firebase-admin';
import { firebaseAdmin } from '../../firebase/firebase';
import { PrismaService } from '../../prisma.service';
import { GetUsersQueryDTO, UserDTO } from './dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findAndCount(this: any, filter: GetUsersQueryDTO): Promise<Page<User>> {
    const where: Prisma.UserWhereInput = {
      id: {
        in: filter.ids,
      },
      AND: [],
    };
    const filterArray: any[] = [];
    for (const key in filter) {
      if (key !== 'ids' && filter[key]) {
        const field = key as keyof Prisma.UserWhereInput;
        filterArray.push({
          [field]: {
            contains: filter[key] as string,
            mode:     'insensitive',
          },
        });
      }
    }
    where.AND = filterArray;
    return {
      rows: await this.prismaService.user.findMany({
        orderBy: { id: 'asc' },
        where,
      }),
      count: await this.prismaService.user.count({ where }),
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
      .catch((_: any) => {
        throw new NotFoundException({ message: 'User not found' });
      });

    if (!user) {
      throw new NotFoundException({ message: 'User not found' });
    }

    await firebaseAdmin.auth().deleteUser(user.uid);

    return user;
  }

  async getUserByToken(authHeader: string): Promise<User | null> {
    try {
      const token = authHeader.split(' ')[1];
      const payload = await admin.auth().verifyIdToken(token);

      if (!payload || !payload.email) return null;

      return this.getUserByEmail(payload.email!);
    } catch (error) {
      throw new UnauthorizedException({
        message: `The token is invalid: ${error}`,
      });
    }
  }
}
