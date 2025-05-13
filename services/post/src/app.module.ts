import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { ReplyModule } from './reply/reply.module';

@Module({
  imports: [PostModule, CommentModule, ReplyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
