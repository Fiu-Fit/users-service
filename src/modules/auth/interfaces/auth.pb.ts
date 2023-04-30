/* eslint-disable */
import { Observable } from 'rxjs';

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

export interface AuthServiceClient {
  register(request: RegisterRequest): Observable<Token>;

  login(request: LoginRequest): Observable<Token>;

  validate(request: Token): Observable<ValidResponse>;

  logout(request: Empty): Observable<Empty>;
}

export interface AuthServiceController {
  register(
    request: RegisterRequest
  ): Promise<Token> | Observable<Token> | Token;

  login(request: LoginRequest): Promise<Token> | Observable<Token> | Token;

  validate(
    request: Token
  ): Promise<ValidResponse> | Observable<ValidResponse> | ValidResponse;

  logout(request: Empty): Promise<Empty> | Observable<Empty> | Empty;
}
