import { RoleEnumToName } from '@fiu-fit/common';
import { Role } from '@prisma/client';
import { UserRoles } from '../modules/user/interfaces/user.interface';

export const RoleTransformer = (roleNumber: number): Role =>
  Role[RoleEnumToName[roleNumber] as UserRoles];
