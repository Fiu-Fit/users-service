import { Role } from '@prisma/client';

export type UserRoles = keyof typeof Role;
