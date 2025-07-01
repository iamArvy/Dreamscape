import { Module } from '@nestjs/common';
import { ParticipantService } from './service';
import { ParticipantController } from './controller';
import { ParticipantResolver } from './resolver';
import { ConversationModule } from 'src/conversation/module';
import { PrismaModule } from 'src/prisma/module';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [forwardRef(() => ConversationModule), PrismaModule],
  controllers: [ParticipantController],
  providers: [ParticipantService, ParticipantResolver],
  exports: [ParticipantService],
})
export class ParticipantModule {}
