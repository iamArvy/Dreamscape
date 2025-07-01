import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  // private model = this.prisma.conversation;

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({
      data,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    select?: Prisma.UserSelect;
  }): Promise<User[] | []> {
    return await this.prisma.user.findMany(params);
  }

  async user(params: {
    where: Prisma.UserWhereUniqueInput;
    select?: Prisma.UserSelect;
  }): Promise<User | null> {
    // await this.checkIfUserInConversation(cid, uid);
    return await this.prisma.user.findUnique(params);
  }

  update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }) {
    return this.prisma.user.update(params);
  }

  async delete(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
