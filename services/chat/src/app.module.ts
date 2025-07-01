import { Module } from '@nestjs/common';
import { ConversationModule } from './conversation/module';
import { MessageModule } from './message/module';
import { ConfigModule } from '@nestjs/config';
import { GroupModule } from './group/group.module';
@Module({
  imports: [
    ConversationModule,
    MessageModule,
    ConfigModule.forRoot({ isGlobal: true }),
    GroupModule,
  ],
})
export class AppModule {}
