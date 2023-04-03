export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface JwtPayload {
  email: string;
  sub: number;
}
