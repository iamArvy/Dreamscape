import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';

@Injectable()
export class FriendRepository {
  constructor(private prisma: PrismaService) {}
  get(uid: string, fid: string) {
    return this.prisma.friend.findUnique({
      where: {
        user1_id_user2_id: {
          user1_id: uid,
          user2_id: fid,
        },
        user2_id_user1_id: {
          user1_id: fid,
          user2_id: uid,
        },
      },
    });
  }

  getOrThrow(uid: string, fid: string) {
    return this.prisma.friend.findUniqueOrThrow({
      where: {
        user1_id_user2_id: {
          user1_id: uid,
          user2_id: fid,
        },
        user2_id_user1_id: {
          user1_id: fid,
          user2_id: uid,
        },
      },
    });
  }

  getAll(user_id: string) {
    return this.prisma.friend.findMany({
      where: {
        user1_id: user_id,
        user2_id: user_id,
      },
    });
  }
}
