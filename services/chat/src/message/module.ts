import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [MessageController],
  imports: [DbModule],
  providers: [MessageService],
})
export class MessageModule {}
