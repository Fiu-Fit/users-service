import { Page } from '@fiu-fit/common';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { GetAuthMetricsQueryDTO } from './dto';

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

  getLoginMetrics(filter: GetAuthMetricsQueryDTO): Promise<Page<User>> {
    const where = {
      federatedIdentity: filter.federatedIdentity,
      blocked:           filter.blocked,
      lastLogin:         {
        gte: filter.start,
        lte: filter.end,
      },
    };

    return this.findAndCount(where);
  }

  getRegisterMetrics(filter: GetAuthMetricsQueryDTO): Promise<Page<User>> {
    const where = {
      federatedIdentity: filter.federatedIdentity,
      blocked:           filter.blocked,
      createdAt:         {
        gte: filter.start,
        lte: filter.end,
      },
    };

    return this.findAndCount(where);
  }

  getPasswordResetMetrics(filter: GetAuthMetricsQueryDTO): Promise<Page<User>> {
    const where = {
      federatedIdentity: filter.federatedIdentity,
      blocked:           filter.blocked,
      createdAt:         {
        gte: filter.start,
        lte: filter.end,
      },
    };

    return this.findAndCount(where);
  }
}
