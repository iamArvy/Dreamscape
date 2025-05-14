import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
// import { UseGuards } from '@nestjs/common';
// import { PermissionsGuard } from './guards';
// import { Permission } from './decorators';
import { AppService } from './app.service';
import { User } from 'types';
import { Conversation } from './conversation/conversation.entity';
import { Participant } from './participant/participant.entity';
@Resolver()
export class ParticipantResolver {
  constructor(private readonly service: AppService) {}

  @Mutation(() => Conversation, { name: 'start_new_conversation' })
  async startNewConversation(
    @Context('req') req: { user: User },
    @Args('users') user: User,
  ) {
    const users = [req.user, user];
    return await this.service.startNewConversation(users);
  }

  @Mutation(() => Conversation, { name: 'create_group' })
  async createGroup(
    @Context('req') req: { user: User },
    @Args('users') users: User[],
  ) {
    return await this.service.createGroup(req.user, users);
  }

  // @UseGuards(PermissionsGuard)
  // @Permission('canAddParticipant')
  @Mutation(() => Boolean, { name: 'add_user_to_group' })
  async addUserToGroup(
    @Context('req') req: { user: string },
    @Args('cid') cid: string,
    @Args('uid') uid: User,
  ) {
    return await this.service.addUserToGroup(req.user, cid, uid);
  }

  @Query(() => Conversation, { name: 'conversations' })
  async getConversations(@Context('req') req: { user: string }) {
    return await this.service.getUserConversations(req.user);
  }

  @Query(() => Conversation, { name: 'conversation' })
  async getConversion(
    @Context('req') req: { user: string },
    @Args('cid') cid: string,
  ) {
    return await this.service.getConversation(req.user, cid);
  }

  @Query(() => Conversation, { name: 'conversation' })
  async getConversionMessages(
    @Context('req') req: { user: string },
    @Args('cid') cid: string,
  ) {
    return await this.service.getConversationMessages(req.user, cid);
  }

  @Query(() => [Participant], { name: 'get_conversation_participants' })
  async getConversationParticipants(
    @Context('req') req: { user: string },
    @Args('cid') cid: string,
  ) {
    return await this.service.getConversationParticipants(req.user, cid);
  }

  @Mutation(() => Boolean, { name: 'remove_user_from_group' })
  async removeUserFromGroup(
    @Context('req') req: { user: string },
    @Args('cid') cid: string,
    @Args('pid') pid: string,
  ) {
    return await this.service.removeUserFromGroup(req.user, cid, pid);
  }

  @Mutation(() => Boolean, { name: 'leave_group' })
  async leaveGroup(
    @Context('req') req: { user: string },
    @Args('cid') cid: string,
  ) {
    await this.service.leaveGroup(req.user, cid);
    return true;
  }

  @Mutation(() => Boolean, { name: 'delete_group' })
  async deleteGroup(
    @Context('req') req: { user: string },
    @Args('cid') cid: string,
  ) {
    await this.service.deleteGroup(req.user, cid);
    return true;
  }

  @Mutation(() => Boolean, { name: 'make_admin' })
  async makeAdmin(
    @Context('req') req: { user: string },
    @Args('cid') cid: string,
    @Args('pid') pid: string,
  ) {
    await this.service.makeAdmin(req.user, cid, pid);
    return true;
  }

  @Mutation(() => Boolean, { name: 'remove_admin' })
  async removeAdmin(
    @Context('req') req: { user: string },
    @Args('cid') cid: string,
    @Args('pid') pid: string,
  ) {
    await this.service.makeAdmin(req.user, cid, pid);
    return true;
  }

  @Mutation(() => Boolean, { name: 'change_ownership' })
  async changeOwnership(
    @Context('req') req: { user: string },
    @Args('cid') cid: string,
    @Args('pid') pid: string,
  ) {
    await this.service.changeOwnership(req.user, cid, pid);
    return true;
  }
}
