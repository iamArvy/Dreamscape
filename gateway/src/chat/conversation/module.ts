import { ConversationController } from './controller';
import { Module } from '@nestjs/common';
import { ConversationService } from './service';
import { PrismaService } from 'src/prisma/service';
import { ParticipantModule } from '../participant/module';
import { ConversationResolver } from './resolver';
import { forwardRef } from '@nestjs/common';

@Module({
  controllers: [ConversationController],
  imports: [forwardRef(() => ParticipantModule)],
  providers: [ConversationService, PrismaService, ConversationResolver],
  exports: [ConversationService],
})
export class ConversationModule {}
