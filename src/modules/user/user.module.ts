import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { grpcClientOptions } from '../../../grpc-client-options';
import { PrismaService } from '../../prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        ...grpcClientOptions,
      },
    ]),
  ],
  exports:     [UserService],
  controllers: [UserController],
  providers:   [UserService, PrismaService],
})
export class UserModule {}
