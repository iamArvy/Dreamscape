import { ConversationController } from './conversation.controller';
import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { DbModule } from 'src/db/db.module';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  controllers: [ConversationController],
  imports: [DbModule, CacheModule],
  providers: [ConversationService],
})
export class ConversationModule {}
