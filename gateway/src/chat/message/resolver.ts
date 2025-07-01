import { ParticipantService } from 'src/participant/service';
import { MessageEntity } from './entity';
import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { MessageService } from './service';

@UseGuards(GqlAuthGuard)
@Resolver('messages')
export class MessageResolver {
  constructor(
    private readonly service: MessageService,
    private readonly participantService: ParticipantService,
  ) {}

  @Query(() => [MessageEntity], { name: 'all' })
  async getConversionMessages(
    @Context('req') req: { user: string },
    @Args('cid') cid: string,
  ) {
    await this.participantService.getConversationParticipant(req.user, cid);
    return await this.service.getConversationMessages(req.user, cid);
  }
}
