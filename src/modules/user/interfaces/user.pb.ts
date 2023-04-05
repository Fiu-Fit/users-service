/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const protobufPackage = 'user';

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

export const USER_PACKAGE_NAME = 'user';

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

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['findById', 'findAll', 'put', 'deleteById'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcMethod(USER_SERVICE_NAME, method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcStreamMethod(USER_SERVICE_NAME, method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
  };
}

export const USER_SERVICE_NAME = 'UserService';
