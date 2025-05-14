import { PrismaService } from './prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
// import { handlePrismaError } from '../utils';
// import { UpdatePasswordInput } from '../Input';

// const modelName = 'User';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // private model = this.prisma.user;
  public = {
    id: true,
    email: true,
  };

  async user(params: {
    where: Prisma.UserWhereUniqueInput;
    select?: Prisma.UserSelect;
  }): Promise<User | null> {
    const { where, select } = params;
    // try {
    return this.prisma.user.findUnique({
      where,
      select,
    });
    // } catch (error) {
    //   // handlePrismaError(error, modelName);
    // }
  }
  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[] | []> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    // try {
    return await this.prisma.user.create({
      data,
    });
    // } catch (error) {
    //   handlePrismaError(error, modelName);
    // }
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.UserWhereUniqueInput): Promise<User> {
    // try {
    return this.prisma.user.delete({ where });
    // } catch (error) {
    //   handlePrismaError(error, modelName);
    // }
  }
}
