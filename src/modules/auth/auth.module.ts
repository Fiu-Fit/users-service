import { DEFAULT_PROTO_PATH } from '@fiu-fit/common';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaService } from '../../prisma.service';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AUTH_PACKAGE_NAME, AUTH_SERVICE_NAME } from './interfaces/auth.pb';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret:      process.env.JWT_PRIVATE_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }),
    ClientsModule.register([
      {
        name:      AUTH_SERVICE_NAME,
        transport: Transport.GRPC,
        options:   {
          url:       process.env.USER_SERVICE_URL,
          package:   AUTH_PACKAGE_NAME,
          protoPath: `${DEFAULT_PROTO_PATH}/auth.proto`,
        },
      },
    ]),
  ],
  exports:     [AuthService],
  controllers: [AuthController],
  providers:   [PrismaService, AuthService, UserService],
})
export class AuthModule {}
