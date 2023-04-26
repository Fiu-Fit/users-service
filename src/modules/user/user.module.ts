import { DEFAULT_PROTO_PATH } from '@fiu-fit/common';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaService } from '../../prisma.service';
import { USER_PACKAGE_NAME, USER_SERVICE_NAME } from './interfaces/user.pb';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name:      USER_SERVICE_NAME,
        transport: Transport.GRPC,
        options:   {
          url:       process.env.USER_SERVICE_URL,
          package:   USER_PACKAGE_NAME,
          protoPath: `${DEFAULT_PROTO_PATH}/user.proto`,
        },
      },
    ]),
  ],
  exports:     [UserService],
  controllers: [UserController],
  providers:   [UserService, PrismaService],
})
export class UserModule {}
