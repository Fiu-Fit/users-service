import { MetricStatus } from '@prisma/client';

export interface GoalDTO {
  id: number;
  title: string;
  description: string;
  metricId: number;
  metricStatus: MetricStatus;
  expireDate?: Date;
  updatedAt?: Date;
}
