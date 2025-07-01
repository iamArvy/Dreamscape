import { JwtAuthGuard } from '../guards/jwt.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { ParticipantService } from './service';
import { ParticipantResponse } from './response';
import { AddParticipantsInput } from './input';
import { ConversationService } from 'src/conversation/service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class ParticipantController {
  constructor(
    private readonly service: ParticipantService,
    private readonly conversationService: ConversationService,
  ) {}

  // Add Users to Group
  @ApiOkResponse({
    description: 'True or False Response',
    type: Boolean,
  })
  @ApiParam({
    name: 'id',
    description: 'Conversation ID',
    example: '6827da23872f1493c7232389',
  })
  @Post('group/:cid/add_users')
  async addUsersToGroup(
    @Req() req: Request & { user: string },
    @Param('cid') cid: string,
    @Body('data') data: AddParticipantsInput,
  ) {
    const participant = await this.service.getConversationParticipant(
      req.user,
      cid,
    );
    const conversation = await this.conversationService.getConversation(
      req.user,
    );
    await this.service.addUsersToGroup(
      data.users,
      cid,
      participant.is_admin,
      conversation.group ?? false,
    );
    return true;
  }

  // Get Conversation Participants
  @ApiOkResponse({
    description: 'Array of Conversation Participants',
    type: [ParticipantResponse],
  })
  @ApiParam({
    name: 'id',
    description: 'Conversation ID',
    example: '6827da23872f1493c7232389',
  })
  @Get('group/:cid/participants')
  async getConversationParticipants(
    @Req() req: Request & { user: string },
    @Param('cid') cid: string,
  ) {
    await this.service.getConversationParticipant(req.user, cid);
    return await this.service.getConversationParticipants(cid);
  }

  // Add Admin Status
  @ApiOkResponse({
    description: 'Boolean',
    type: Boolean,
  })
  @ApiParam({
    name: 'cid',
    description: 'Conversation ID',
    example: '6827da23872f1493c7232389',
  })
  @ApiParam({
    name: 'pid',
    description: 'Participant ID',
    example: '6827da23872f1493c7232389',
  })
  @Post('group/:cid/make_admin/:pid')
  async makeAdmin(
    @Req() req: Request & { user: string },
    @Param('cid') cid: string,
    @Param('pid') pid: string,
  ) {
    const user = await this.service.getConversationParticipant(req.user, cid);
    const participant = await this.service.getConversationParticipant(pid, cid);
    await this.conversationService.getConversation(cid);
    await this.service.makeAdmin(pid, user.is_admin, participant.is_admin);
    return true;
  }

  // Remove Admin Status
  @ApiOkResponse({
    description: 'Boolean',
    type: Boolean,
  })
  @ApiParam({
    name: 'cid',
    description: 'Conversation ID',
    example: '6827da23872f1493c7232389',
  })
  @ApiParam({
    name: 'pid',
    description: 'Participant ID',
    example: '6827da23872f1493c7232389',
  })
  @Post('group/:cid/remove_admin/:pid')
  async removeAdmin(
    @Req() req: Request & { user: string },
    @Param('cid') cid: string,
    @Param('pid') pid: string,
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

  // Remove User from Group
  @ApiOkResponse({
    description: 'Participant that was removed',
    type: ParticipantResponse,
  })
  @ApiParam({
    name: 'cid',
    description: 'Conversation ID',
    example: '6827da23872f1493c7232389',
  })
  @ApiParam({
    name: 'pid',
    description: 'Participant ID',
    example: '6827da23872f1493c7232389',
  })
  @Post('group/:cid/remove/:pid')
  async removeUserFromGroup(
    @Req() req: Request & { user: string },
    @Param('cid') cid: string,
    @Param('pid') pid: string,
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

  // Leave Group
  @ApiOkResponse({
    description: 'True or False',
    type: Boolean,
  })
  @ApiParam({
    name: 'cid',
    description: 'Conversation ID',
    example: '6827da23872f1493c7232389',
  })
  @Post('user/leave/:cid')
  async leaveGroup(
    @Req() req: Request & { user: string },
    @Param('cid') cid: string,
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
