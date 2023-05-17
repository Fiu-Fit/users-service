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

  async findAndCount(filter: GetUsersQueryDTO): Promise<Page<User>> {
    const response = filter.params
      ? await this.simpleFilter(filter)
      : await this.advancedFilter(filter);
    return response;
  }

  async simpleFilter(filter: GetUsersQueryDTO): Promise<Page<User>> {
    const { params } = filter;
    const where: Prisma.UserWhereInput = {
      OR: [],
    };
    const filterArray: any[] = [];
    const paramsArray: string[] = params?.split(' ') ?? [];
    const fields = Object.getOwnPropertyNames(filter);
    paramsArray.map(param => {
      fields.map(field => {
        if (field != 'ids' && field != 'role' && field != 'params') {
          filterArray.push({
            [field as keyof Prisma.UserWhereInput]: {
              contains: param,
              mode:     'insensitive',
            },
          });
        }
      });
    });
    where.OR = filterArray;
    return {
      rows: await this.prismaService.user.findMany({
        orderBy: { id: 'asc' },
        where,
      }),
      count: await this.prismaService.user.count({ where }),
    };
  }

  async advancedFilter(filter: GetUsersQueryDTO): Promise<Page<User>> {
    const { ids, role, ...filters } = filter;
    const where: Prisma.UserWhereInput = {
      id: {
        in: ids,
      },
      AND: [],
    };
    const filterArray: any[] = [];
    if (role) {
      filterArray.push({
        role: {
          equals: role,
        },
      });
    }
    for (const key in filters) {
      if (filters[key]) {
        const field = key as keyof Prisma.UserWhereInput;
        filterArray.push({
          [field]: {
            contains: filters[key] as string,
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

  async deleteUser(id: number): Promise<User> {
    const user = await this.prismaService.user
      .delete({
        where: {
          id,
        },
      })
      .catch(() => {
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
