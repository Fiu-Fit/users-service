import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { grcpClientOptions } from '../../../grcp-client-options';
import { PrismaService } from '../../prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        ...grcpClientOptions,
      },
    ]),
  ],
  exports:     [UserService],
  controllers: [UserController],
  providers:   [UserService, PrismaService],
})
export class UserModule {}
