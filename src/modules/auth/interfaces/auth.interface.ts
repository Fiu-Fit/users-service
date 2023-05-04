import { Role } from '@prisma/client';

export interface JwtPayload {
  email: string;
  sub: number;
}

export interface Token {
  token: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}
