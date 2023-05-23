import { Page } from '@fiu-fit/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { Follower, User } from '@prisma/client';
import { FollowerService } from './follower.service';

@Controller('followers')
@Injectable()
export class FollowerController {
  constructor(private readonly followerService: FollowerService) {}

  @Post('follow')
  followUser(
    @Query('id') id: number,
    @Body('userIdToFollow') userIdToFollow: number
  ): Promise<Follower> {
    return this.followerService.followUser(userIdToFollow, id);
  }

  @Get('followers')
  getFollowers(@Query('id', ParseIntPipe) id: number): Promise<Page<User>> {
    return this.followerService.getUserFollowers(id);
  }

  @Get('following')
  getFollowing(@Query('id', ParseIntPipe) id: number): Promise<Page<User>> {
    return this.followerService.getUserFollowings(id);
  }

  @Delete('unfollow')
  unfollowUser(
    @Query('id', ParseIntPipe) id: number,
    @Query('followerId', ParseIntPipe) followerId: number
  ): Promise<Follower> {
    return this.followerService.unfollowUser(id, followerId);
  }
}
