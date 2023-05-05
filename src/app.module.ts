import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { GoalModule } from './modules/goals/goal.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports:     [ConfigModule.forRoot(), UserModule, AuthModule, GoalModule],
  controllers: [AppController],
  providers:   [AppService],
})
export class AppModule {}
