import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import {
  ConversationService,
  MessageService,
  ParticipantService,
  PrismaService,
} from './services';
@Module({
  controllers: [AppController],
  providers: [
    AppService,
    AppGateway,
    PrismaService,
    ConversationService,
    MessageService,
    ParticipantService,
  ],
})
export class AppModule {}
