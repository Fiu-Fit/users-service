import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import { compare } from 'bcrypt';
import {
  UserCredential,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { PrismaService } from '../../prisma.service';
import { RoleTransformer } from '../../shared/RoleTransformer';
import { UserService } from '../user/user.service';
import { firebaseApp } from './firebase';
import {
  JwtPayload,
  LoginRequest,
  RegisterRequest,
} from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  validateNewUser(user: RegisterRequest): void {
    if (!Object.values(Role).includes(RoleTransformer(user.role))) {
      throw new BadRequestException({
        message: 'Invalid Role',
      });
    }
  }

  async register(newUser: RegisterRequest): Promise<{ token: string }> {
    this.validateNewUser(newUser);

    const auth = getAuth(firebaseApp);
    let userCredentials: UserCredential;
    try {
      userCredentials = await createUserWithEmailAndPassword(
        auth,
        newUser.email,
        newUser.password
      );
    } catch (error) {
      throw new BadRequestException({
        message: `Error while registering: ${error}`,
      });
    }

    return this.createToken(userCredentials.user.uid, newUser.email);
  }

  async login(loginInfo: LoginRequest): Promise<{ token: string }> {
    const auth = getAuth(firebaseApp);
    let userCredentials: UserCredential;
    try {
      userCredentials = await signInWithEmailAndPassword(
        auth,
        loginInfo.email,
        loginInfo.password
      );
    } catch (error) {
      throw new BadRequestException({
        message: 'Invalid Credentials',
      });
    }

    return this.createToken(userCredentials.user.uid, loginInfo.email);
  }

  createToken(uid: string, email: string): { token: string } {
    const payload = {
      uid,
      email,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      return null;
    }
    const isValidPassword = await compare(password, user.password);
    return isValidPassword ? user : null;
  }

  validateUserByToken(token: string): Promise<User | null> {
    const payload = this.jwtService.verify<JwtPayload>(token);
    return this.userService.getUserByEmail(payload.email);
  }
}
