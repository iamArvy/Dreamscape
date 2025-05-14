import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import { ConversationModule } from './conversation/conversation.module';
import { ParticipantModule } from './participant/participant.module';
import { MessageModule } from './message/message.module';
@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.DB_URL ||
        'mongodb://root:example@localhost:27017/auth?authSource=admin',
    ),
    ConversationModule,
    MessageModule,
    ParticipantModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
