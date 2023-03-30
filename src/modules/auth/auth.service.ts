import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import { compare, genSaltSync, hashSync } from 'bcrypt';
import { PrismaService } from '../../prisma.service';
import { UserDto } from '../user/user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateNewUser(user: UserDto): Promise<void> {
    if (await this.userService.getUserByEmail(user.email)) {
      throw new BadRequestException({
        message: 'Email esta en uso',
      });
    }

    if (!Object.values(Role).includes(user.role)) {
      throw new BadRequestException({
        message: 'Rol no valido',
      });
    }
  }

  async signUpUser(user: UserDto): Promise<{ token: string }> {
    await this.validateNewUser(user);

    const salt = genSaltSync(Number(process.env.SALT_ROUNDS));
    user.password = hashSync(user.password, salt);

    const createdUser = await this.prismaService.user.create({ data: user });

    return this.createToken(createdUser);
  }

  loginUser(user: User): { token: string } {
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
