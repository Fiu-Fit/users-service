export enum Category {
  Legs = 0,
  Chest = 1,
  Back = 2,
  Shoulders = 3,
  Arms = 4,
  Core = 5,
  Cardio = 6,
  Fullbody = 7,
  Freeweight = 8,
  Stretching = 9,
  Strength = 10,
}

export enum GoalStatus {
  InProgress = 0,
  Completed = 1,
  CompletedLate = 2,
}

export interface Goal {
  id: number;
  title: string;
  description: string;
  userId: number;
  targetValue: number;
  actualValue?: number;
  deadline?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  category: Category;
  status: GoalStatus;
}
