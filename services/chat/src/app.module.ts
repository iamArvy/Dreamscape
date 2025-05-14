import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import {
  ConversationService,
  MessageService,
  ParticipantService,
} from './services';
import { ConversationModule } from './conversation/conversation.module';
import { ParticipantModule } from './participant/participant.module';
import { MessageModule } from './message/message.module';
@Module({
  MongooseModule.forRoot(
    process.env.DB_URL ||
      'mongodb://root:example@localhost:27017/auth?authSource=admin',
  ),
  controllers: [AppController],
  providers: [
    AppService,
    AppGateway,
    ConversationService,
    MessageService,
    ParticipantService,
  ],
  imports: [ConversationModule, MessageModule, ParticipantModule],
})
export class AppModule {}
