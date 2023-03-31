import { Role } from '@prisma/client';

export interface UserId {
  id: number;
}

export interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}
