/* eslint-disable */
import { Observable } from 'rxjs';

export enum Role {
  Admin = 0,
  Athlete = 1,
  Trainer = 2,
  UNRECOGNIZED = -1,
}

export interface UserId {
  id: number;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

export interface Empty {}

export interface UserPages {
  rows: User[];
  count: number;
}

export interface UserServiceClient {
  findById(request: UserId): Observable<User>;

  findAll(request: Empty): Observable<UserPages>;

  put(request: User): Observable<User>;

  deleteById(request: UserId): Observable<User>;
}

export interface UserServiceController {
  findById(request: UserId): Promise<User> | Observable<User> | User;

  findAll(
    request: Empty
  ): Promise<UserPages> | Observable<UserPages> | UserPages;

  put(request: User): Promise<User> | Observable<User> | User;

  deleteById(request: UserId): Promise<User> | Observable<User> | User;
}
