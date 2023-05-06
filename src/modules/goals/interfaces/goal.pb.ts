export enum MetricStatus {
  Todo = 0,
  InProgress = 1,
  Completed = 2,
  Unrecognized = -1,
}

export interface MetricId {
  id: number;
}

export interface Goal {
  id: number;
  title: string;
  description: string;
  metricId: number;
  metricStatus: MetricStatus;
  userId: number;
  deadline?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
