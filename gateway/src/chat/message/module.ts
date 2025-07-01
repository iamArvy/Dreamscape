import { MessageResolver } from './resolver';
import { Module } from '@nestjs/common';
import { MessageService } from './service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schema';
import { MessageController } from './controller';
import { ParticipantModule } from 'src/participant/module';

@Module({
  controllers: [MessageController],
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    ParticipantModule,
  ],
  providers: [MessageService, MessageResolver],
  exports: [MessageService],
})
export class MessageModule {}
