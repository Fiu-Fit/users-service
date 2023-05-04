import { Role } from '@prisma/client';

export interface UserDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}
