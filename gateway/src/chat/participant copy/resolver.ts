import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { Participant } from './entity';
import { AddUsersToGroupArgs } from './input';
import { ParticipantService } from 'src/participant/service';
import { ConversationService } from 'src/conversation/service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/guards';

@UseGuards(GqlAuthGuard)
@Resolver()
export class ParticipantResolver {
  constructor(
    private readonly service: ParticipantService,
    private readonly conversationService: ConversationService,
  ) {}

  @Mutation(() => Boolean, { name: 'add_user_to_group' })
  async addUserToGroup(
    @Context('req') req: { user: string },
    @Args() args: AddUsersToGroupArgs,
  ) {
    const { cid, users } = args;
    const participant = await this.service.getConversationParticipant(
      req.user,
      cid,
    );
    const conversation = await this.conversationService.getConversation(
      req.user,
    );
    await this.service.addUsersToGroup(
      users,
      cid,
      participant.is_admin,
      conversation.group ?? false,
    );
    return conversation;
  }

  @Query(() => [Participant], { name: 'get_conversation_participants' })
  async getConversationParticipants(
    @Context('req') req: { user: string },
    @Args('cid') cid: string,
  ) {
    await this.service.getConversationParticipant(req.user, cid);
    return await this.service.getConversationParticipants(cid);
  }

  @Mutation(() => Boolean, { name: 'make_admin' })
  async makeAdmin(
    @Context('req') req: { user: string },
    @Args('cid') cid: string,
    @Args('pid') pid: string,
  ) {
    const user = await this.service.getConversationParticipant(req.user, cid);
    const participant = await this.service.getConversationParticipant(pid, cid);
    await this.conversationService.getConversation(cid);
    await this.service.makeAdmin(pid, user.is_admin, participant.is_admin);
    return true;
  }

  @Mutation(() => Boolean, { name: 'remove_admin' })
  async removeAdmin(
    @Context('req') req: { user: string },
    @Args('cid') cid: string,
    @Args('pid') pid: string,
  ) {
    const user = await this.service.getConversationParticipant(req.user, cid);
    const participant = await this.service.getConversationParticipant(pid, cid);
    const conversation = await this.conversationService.getConversation(cid);
    await this.service.removeAdmin(
      pid,
      user.is_admin,
      participant.is_admin,
      conversation.creator_id === pid,
    );
    return true;
  }

  @Mutation(() => Boolean, { name: 'remove_user_from_group' })
  async removeUserFromGroup(
    @Context('req') req: { user: string },
    @Args('cid') cid: string,
    @Args('pid') pid: string,
  ) {
    const user = await this.service.getConversationParticipant(req.user, cid);
    await this.service.getConversationParticipant(pid, cid);
    const conversation = await this.conversationService.getConversation(cid);
    return await this.service.removeUserFromGroup(
      cid,
      pid,
      user.is_admin,
      conversation.creator_id === pid,
    );
  }

  @Mutation(() => Boolean, { name: 'leave_group' })
  async leaveGroup(
    @Context('req') req: { user: string },
    @Args('cid') cid: string,
  ) {
    await this.service.getConversationParticipant(req.user, cid);
    const conversation = await this.conversationService.getConversation(cid);
    await this.service.leaveGroup(
      req.user,
      cid,
      conversation.creator_id === req.user,
    );
    return true;
  }
}
