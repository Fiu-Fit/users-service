import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../../prisma.service';
import { UserService } from '../user/user.service';
import { FollowerService } from './follower.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    HttpModule,
  ],
  controllers: [],
  providers:   [FollowerService, PrismaService, UserService],
})
export class FollowerModule {}
