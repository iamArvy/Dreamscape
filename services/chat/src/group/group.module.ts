import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { DbModule } from 'src/db/db.module';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [DbModule, CacheModule],
  providers: [GroupService],
  controllers: [GroupController],
})
export class GroupModule {}
