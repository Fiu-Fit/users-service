import { Page } from '@fiu-fit/common';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { GetUsersMetricsQueryDTO } from './dto';

@Injectable()
export class MetricsService {
  constructor(private prismaService: PrismaService) {}

  async findAndCount(where: any): Promise<Page<any>> {
    return {
      rows: await this.prismaService.user.findMany({
        where,
        select: {
          id:                true,
          firstName:         true,
          lastName:          true,
          email:             true,
          federatedIdentity: true,
          lastLogin:         true,
          createdAt:         true,
          blocked:           true,
        },
      }),
      count: await this.prismaService.user.count({ where }),
    };
  }

  getLoginMetrics(filter: GetUsersMetricsQueryDTO): Promise<Page<User>> {
    const where = {
      federatedIdentity: filter.federatedIdentity,
      lastLogin:         {
        gte: filter.start,
        lte: filter.end,
      },
    };

    return this.findAndCount(where);
  }

  getRegisterMetrics(filter: GetUsersMetricsQueryDTO): Promise<Page<User>> {
    const where = {
      federatedIdentity: filter.federatedIdentity,
      createdAt:         {
        gte: filter.start,
        lte: filter.end,
      },
    };

    return this.findAndCount(where);
  }

  getBlockedMetrics(): Promise<Page<User>> {
    const where = {
      blocked: true,
    };

    return this.findAndCount(where);
  }
}
