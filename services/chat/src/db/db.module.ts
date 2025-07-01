import { Module } from '@nestjs/common';
import { PrismaService } from './prisma';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schemas/message.schema';
import { FriendRepository } from './repositories/friend.repository';
import { ConversationRepository } from './repositories/conversation.repository';
import { MessageRepository } from './repositories/message.repository';
import { ParticipantRepository } from './repositories/participant.repository';
import { UserService } from './repositories/user.repository';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_DB_URL ||
        'mongodb://root:example@localhost:27017/auth?authSource=admin',
    ),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  providers: [
    PrismaService,
    FriendRepository,
    ConversationRepository,
    MessageRepository,
    ParticipantRepository,
    UserService,
  ],
  exports: [
    FriendRepository,
    ConversationRepository,
    MessageRepository,
    ParticipantRepository,
    UserService,
  ],
})
export class DbModule {}
