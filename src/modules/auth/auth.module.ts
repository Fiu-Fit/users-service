import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../../prisma.service';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret:      process.env.JWT_PRIVATE_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }),
  ],
  exports:     [AuthService],
  controllers: [AuthController],
  providers:   [PrismaService, AuthService, UserService],
})
export class AuthModule {}
