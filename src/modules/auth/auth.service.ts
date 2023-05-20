import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import {
  UserCredential,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { firebaseApp } from '../../firebase/firebase';
import { PrismaService } from '../../prisma.service';
import { UserService } from '../user/user.service';
import { LoginRequest, RegisterRequest } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService
  ) {}

  async register(newUser: RegisterRequest): Promise<{ token: string }> {
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
          uid: userCredentials.user.uid,
        },
      });

      token = await userCredentials.user.getIdToken();
    } catch (error: any) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new ConflictException({
            message: `Email already in use: ${error}`,
          });
        case 'auth/invalid-email':
          throw new BadRequestException({ message: `Invalid email: ${error}` });
        case 'auth/weak-password':
          throw new BadRequestException({ message: `Weak password: ${error}` });
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
      userCredentials.user.uid;
      token = await userCredentials.user.getIdToken();
    } catch (error) {
      throw new BadRequestException({
        message: 'Invalid Credentials',
      });
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        uid: userCredentials.user.uid,
      },
    });

    if (!user || user.role === Role.Admin) {
      throw new BadRequestException({
        message: 'Invalid Credentials',
      });
    }

    await this.updateLoginTime(user.uid);

    return { token };
  }

  async adminLogin(loginInfo: LoginRequest): Promise<{ token: string }> {
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

    const user = await this.userService.getUserByEmail(loginInfo.email);

    if (!user || user.role !== Role.Admin) {
      throw new UnauthorizedException({
        message: 'Invalid credentials: You are not an admin',
      });
    }

    await this.updateLoginTime(user.uid);

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

  async updateLoginTime(uid: string): Promise<void> {
    await this.prismaService.user.update({
      where: {
        uid: uid,
      },
      data: {
        lastLogin: new Date(),
      },
    });
  }
}
