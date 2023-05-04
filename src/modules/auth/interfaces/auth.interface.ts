export interface JwtPayload {
  email: string;
  sub: number;
}

export enum Role {
  Admin = 0,
  Athlete = 1,
  Trainer = 2,
  UNRECOGNIZED = -1,
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
