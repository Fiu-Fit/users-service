export enum Role {
  Admin = 0,
  Athlete = 1,
  Trainer = 2,
  UNRECOGNIZED = -1,
}

export interface ValidResponse {
  status: number;
  errors: string[];
  userId: number;
}

export interface Empty {}

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
