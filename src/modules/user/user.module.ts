import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { grpcClientOptions } from '../../../grpc-client-options';
import { PrismaService } from '../../prisma.service';
import { USER_SERVICE_NAME } from './interfaces/user.pb';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: USER_SERVICE_NAME,
        ...grpcClientOptions,
      },
    ]),
  ],
  exports:     [UserService],
  controllers: [UserController],
  providers:   [UserService, PrismaService],
})
export class UserModule {}
