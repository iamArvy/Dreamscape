import { Module } from '@nestjs/common';
import { FriendService } from './service';
import { PrismaModule } from 'src/prisma';

@Module({
  imports: [PrismaModule],
  providers: [FriendService],
  exports: [FriendService],
})
export class FriendModule {}
