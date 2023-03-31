import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { grcpClientOptions } from '../../../grcp-client-options';
import { PrismaService } from '../../prisma.service';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret:      process.env.JWT_PRIVATE_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }),
    ClientsModule.register([
      {
        name: 'AUTH_PACKAGE',
        ...grcpClientOptions,
      },
    ]),
  ],
  exports:     [AuthService],
  controllers: [AuthController],
  providers:   [
    PrismaService,
    AuthService,
    UserService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
