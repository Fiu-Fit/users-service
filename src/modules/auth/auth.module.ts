import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports:     [UserModule],
  exports:     [AuthService],
  controllers: [AuthController],
  providers:   [PrismaService, AuthService, UserService],
})
export class AuthModule {}
