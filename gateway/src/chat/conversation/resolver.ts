import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { ConversationService } from './service';
import { CreateGroupInput } from './input';
import { Conversation } from './entity';
import { ParticipantService } from 'src/participant/service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/guards';

@UseGuards(GqlAuthGuard)
@Resolver('conversations')
export class ConversationResolver {
  constructor(
    private readonly service: ConversationService,
    private readonly participantService: ParticipantService,
  ) {}

  @Query(() => String)
  health(): string {
    return 'OK';
  }

  @Mutation(() => Conversation, { name: 'new' })
  async startNewConversation(
    @Context('req') req: { user: string },
    @Args('recipient') recipient: string,
  ) {
    return await this.service.startNewConversation(req.user, recipient);
  }

  @Mutation(() => Conversation, { name: 'create_group' })
  async createGroup(
    @Context('req') req: { user: string },
    @Args('data') data: CreateGroupInput,
  ) {
    return await this.service.createGroup(req.user, data);
  }

  @Query(() => [Conversation], { name: 'all' })
  async getConversations(@Context('req') req: { user: string }) {
    return await this.service.getUserConversations(req.user);
  }

  @Query(() => Conversation, { name: 'get' })
  async getConversation(
    @Context('req') req: { user: string },
    @Args('cid') cid: string,
  ) {
    await this.participantService.getConversationParticipant(req.user, cid);
    return await this.service.getConversation(cid);
  }

  @Mutation(() => Boolean, { name: 'change_ownership' })
  async changeOwnership(
    @Context('req') req: { user: string },
    @Args('cid') cid: string,
    @Args('pid') pid: string,
  ) {
    await this.participantService.getConversationParticipant(req.user, cid);
    await this.participantService.getConversationParticipant(pid, cid);
    const conversation = await this.service.getConversation(req.user);
    await this.service.changeOwnership(
      req.user,
      cid,
      pid,
      conversation.creator_id === req.user,
    );
    return true;
  }

  @Mutation(() => Boolean, { name: 'delete_group' })
  async deleteGroup(
    @Context('req') req: { user: string },
    @Args('cid') cid: string,
  ) {
    await this.participantService.getConversationParticipant(req.user, cid);
    const conversation = await this.service.getConversation(cid);
    await this.service.deleteGroup(
      cid,
      conversation.creator_id === req.user,
      conversation.group ?? false,
    );
    return true;
  }
}
