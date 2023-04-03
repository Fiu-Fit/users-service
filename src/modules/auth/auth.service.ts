import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import { compare, genSaltSync, hashSync } from 'bcrypt';
import { PrismaService } from '../../prisma.service';
import { RoleTransformer } from '../../shared/RoleTransformer';
import { UserService } from '../user/user.service';
import { LoginRequest, RegisterRequest } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateNewUser(user: RegisterRequest): Promise<void> {
    if (await this.userService.getUserByEmail(user.email)) {
      throw new BadRequestException({
        message: 'Email in use',
      });
    }

    if (!Object.values(Role).includes(RoleTransformer(user.role))) {
      throw new BadRequestException({
        message: 'Invalid Role',
      });
    }
  }

  async register(newUser: RegisterRequest): Promise<{ token: string }> {
    await this.validateNewUser(newUser);

    const salt = genSaltSync(Number(process.env.SALT_ROUNDS));
    newUser.password = hashSync(newUser.password, salt);

    const createdUser = await this.prismaService.user.create({
      data: { ...newUser, role: RoleTransformer(newUser.role) },
    });

    return this.createToken(createdUser);
  }

  async login(loginInfo: LoginRequest): Promise<{ token: string }> {
    const user = await this.validateUser(loginInfo.email, loginInfo.password);

    if (!user) {
      throw new BadRequestException({
        message: 'Invalid Credentials',
      });
    }

    return this.createToken(user);
  }

  createToken(user: User): { token: string } {
    const payload = {
      email: user.email,
      sub:   user.id,
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
}
