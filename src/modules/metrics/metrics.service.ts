import { Injectable } from '@nestjs/common';
import { UserActivityType } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { GetAuthMetricsQueryDTO } from './dto';

@Injectable()
export class MetricsService {
  constructor(private prismaService: PrismaService) {}

  async countUsersRegisterByMonth(where: any, year: number): Promise<number[]> {
    const result: number[] = [];

    for (let i = 0; i < 12; i++) {
      const count = await this.prismaService.user.count({
        where: {
          ...where,
          createdAt: {
            gte: new Date(year, i),
            lt:  new Date(year, i + 1),
          },
        },
      });

      result.push(count);
    }

    return result;
  }

  async countUserActivitiesByMonth(
    where: any,
    year: number
  ): Promise<number[]> {
    const result: number[] = [];

    for (let i = 0; i < 12; i++) {
      const count = await this.prismaService.userActivity.count({
        where: {
          ...where,
          timestamp: {
            gte: new Date(year, i),
            lt:  new Date(year, i + 1),
          },
        },
      });

      result.push(count);
    }

    return result;
  }

  getRegisterMetrics(filter: GetAuthMetricsQueryDTO): Promise<number[]> {
    const where = {
      federatedIdentity: filter.federatedIdentity,
      blocked:           filter.blocked,
    };

    return this.countUsersRegisterByMonth(where, filter.year);
  }

  getLoginMetrics(filter: GetAuthMetricsQueryDTO): Promise<number[]> {
    const where = {
      type: UserActivityType.Login,
      user: {
        federatedIdentity: filter.federatedIdentity,
        blocked:           filter.blocked,
      },
    };

    return this.countUserActivitiesByMonth(where, filter.year);
  }

  getPasswordResetMetrics(filter: GetAuthMetricsQueryDTO): Promise<number[]> {
    const where = {
      type: UserActivityType.PasswordReset,
      user: {
        federatedIdentity: filter.federatedIdentity,
        blocked:           filter.blocked,
      },
    };

    return this.countUserActivitiesByMonth(where, filter.year);
  }
}
