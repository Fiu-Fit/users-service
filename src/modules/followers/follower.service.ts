import { Page } from '@fiu-fit/common';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Follower, User } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class FollowerService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService
  ) {}

  followUser(userId: number, followerId: number): Promise<Follower> {
    return this.prismaService.follower.create({
      data: {
        followerId:  userId,
        followingId: followerId,
      },
    });
  }

  async getUserFollowers(id: number): Promise<Page<User>> {
    const followers = {
      rows: await this.prismaService.follower.findMany({
        orderBy: { id: 'asc' },
        where:   { followingId: id },
      }),
      count: await this.prismaService.follower.count({
        where: { followingId: id },
      }),
    };

    return this.userService.findAndCount({
      ids: followers.rows.map(follower => follower.followerId),
    });
  }

  async getUserFollowings(id: number): Promise<Page<User>> {
    const following = {
      rows: await this.prismaService.follower.findMany({
        orderBy: { id: 'asc' },
        where:   { followerId: id },
      }),
      count: await this.prismaService.follower.count({
        where: { followerId: id },
      }),
    };

    return this.userService.findAndCount({
      ids: following.rows.map(follower => follower.followingId),
    });
  }

  getFollowerById(id: number): Promise<Follower | null> {
    const follower = this.prismaService.follower.findUnique({
      where: { id },
    });

    if (!follower) {
      throw new NotFoundException('Follower not found');
    }
    return follower;
  }

  unfollowUser(followerId: number, followingId: number): Promise<Follower> {
    return this.prismaService.follower.delete({
      where: {
        followerFollowingId: {
          followerId,
          followingId,
        },
      },
    });
  }
}
