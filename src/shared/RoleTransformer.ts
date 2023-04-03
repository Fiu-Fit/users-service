import { RoleEnumToName } from '@fiu-fit/common';
import { Role } from '@prisma/client';
import { UserRoles } from '../modules/user/interfaces/user.interface';

export const RoleTransformer = (role_number: number): Role =>
  Role[RoleEnumToName[role_number] as UserRoles];
