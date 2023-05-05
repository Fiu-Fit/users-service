import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../../prisma.service';
import { GoalController } from './goal.controller';
import { GoalService } from './goal.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
  ],
  exports:     [GoalService],
  controllers: [GoalController],
  providers:   [GoalService, PrismaService],
})
export class GoalModule {}
