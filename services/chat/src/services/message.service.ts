import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { Prisma, Message } from '../../generated/prisma';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}
  // private model = this.prisma.participant;

  async isSender(id: string, uid: string): Promise<boolean> {
    const message = await this.message({
      where: {
        id,
        sender_id: uid,
      },
    });
    if (message) return true;

    return false;
  }

  async create(data: Prisma.MessageCreateInput) {
    return await this.prisma.message.create({
      data,
    });
  }

  messages(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.MessageWhereUniqueInput;
    where?: Prisma.MessageWhereInput;
    orderBy?: Prisma.MessageOrderByWithRelationInput;
  }): Promise<Message[] | []> {
    return this.prisma.message.findMany(params);
  }

  message(params: {
    where: Prisma.MessageWhereUniqueInput;
    select?: Prisma.MessageSelect;
  }): Promise<Message | null> {
    try {
      return this.prisma.message.findUnique(params);
    } catch (error) {
      throw new Error(error as string);
      // handlePrismaError(error, modelName);
    }
  }

  update(params: {
    where: Prisma.MessageWhereUniqueInput;
    data: Prisma.MessageUpdateInput;
  }) {
    return this.prisma.message.update(params);
  }

  async delete(where: Prisma.MessageWhereUniqueInput): Promise<Message> {
    return this.prisma.message.delete({ where });
  }
}
