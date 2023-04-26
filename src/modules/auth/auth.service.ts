import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import {
  UserCredential,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { PrismaService } from '../../prisma.service';
import { RoleTransformer } from '../../shared/RoleTransformer';
import {
  AlreadyExistsException,
  InvalidArgumentException,
} from '../../shared/rpc-exceptions';
import { UserService } from '../user/user.service';
import { firebaseApp } from './firebase';
import { JwtPayload } from './interfaces/auth.interface';
import { LoginRequest, RegisterRequest } from './interfaces/auth.pb';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  validateNewUser(user: RegisterRequest): void {
    if (!Object.values(Role).includes(RoleTransformer(user.role))) {
      throw new InvalidArgumentException('Invalid Role');
    }
  }

  async register(newUser: RegisterRequest): Promise<{ token: string }> {
    this.validateNewUser(newUser);

    const auth = getAuth(firebaseApp);
    let userCredentials: UserCredential;
    let token: string;
    try {
      userCredentials = await createUserWithEmailAndPassword(
        auth,
        newUser.email,
        newUser.password
      );
      const { password, ...userData } = newUser;
      await this.prismaService.user.create({
        data: {
          ...userData,
          uid:  userCredentials.user.uid,
          role: RoleTransformer(userData.role),
        },
      });

      token = await userCredentials.user.getIdToken();
    } catch (error: any) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new AlreadyExistsException('Email already in use');
        case 'auth/invalid-email':
          throw new InvalidArgumentException('Invalid email');
        case 'auth/weak-password':
          throw new InvalidArgumentException('Weak password');
        default:
          throw new BadRequestException({
            message: `Error while registering: ${error}`,
          });
      }
    }

    return { token };
  }

  async login(loginInfo: LoginRequest): Promise<{ token: string }> {
    const auth = getAuth(firebaseApp);
    let userCredentials: UserCredential;
    let token: string;
    try {
      userCredentials = await signInWithEmailAndPassword(
        auth,
        loginInfo.email,
        loginInfo.password
      );
      token = await userCredentials.user.getIdToken();
    } catch (error) {
      throw new BadRequestException({
        message: 'Invalid Credentials',
      });
    }

    return { token };
  }

  async logout(): Promise<void> {
    const auth = getAuth(firebaseApp);
    try {
      await signOut(auth);
    } catch (error) {
      throw new BadRequestException({
        message: `Error while logging out: ${error}`,
      });
    }
  }

  validateUserByToken(token: string): Promise<User | null> {
    const payload = this.jwtService.verify<JwtPayload>(token);
    return this.userService.getUserByEmail(payload.email);
  }
}
