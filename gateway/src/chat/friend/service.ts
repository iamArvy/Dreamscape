import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/service';

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService) {}
  async friend(uid: string, fid: string) {
    return await this.prisma.friend.findUnique({
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
}
