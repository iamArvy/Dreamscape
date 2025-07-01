import { JwtAuthGuard } from '../guards/jwt.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { ParticipantService } from 'src/participant/service';
import { CreateGroupInput } from './input';
import { ConversationService } from './service';
import { ConversationResponse } from './response';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('conversation')
export class ConversationController {
  constructor(
    private readonly service: ConversationService,
    private readonly participantService: ParticipantService,
  ) {}

  // Create Conversation
  @ApiOkResponse({
    description: 'The created conversation',
    type: ConversationResponse,
  })
  @Post('chat/new/:id')
  async startNewConversation(
    @Req() req: Request & { user: string },
    @Param('id') recipient: string,
  ) {
    // Get Friendship
    return await this.service.startNewConversation(req.user, recipient);
  }

  // Create Group
  @ApiOkResponse({
    description: 'The created Group',
    type: ConversationResponse,
  })
  @Post('group/create')
  async createGroup(
    @Req() req: Request & { user: string },
    @Body('data') data: CreateGroupInput,
  ) {
    return await this.service.createGroup(req.user, data);
  }

  // Get User Conversations
  @ApiOkResponse({
    description: 'Array of users conversation',
    type: [ConversationResponse],
  })
  @Get('all')
  async getConversations(@Req() req: Request & { user: string }) {
    return await this.service.getUserConversations(req.user);
  }

  // Get Conversation
  @ApiOkResponse({
    description: 'The Conversation',
    type: ConversationResponse,
  })
  @ApiParam({
    name: 'id',
    description: 'Conversation ID',
    example: '6827da23872f1493c7232389',
  })
  @Get(':cid')
  async getConversation(
    @Req() req: Request & { user: string },
    @Param('cid') cid: string,
  ) {
    await this.participantService.getConversationParticipant(req.user, cid);
    return await this.service.getConversation(cid);
  }

  // Change Ownership
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
  @Post('group/:cid/change_ownership/:pid')
  async changeOwnership(
    @Req() req: Request & { user: string },
    @Param('cid') cid: string,
    @Param('pid') pid: string,
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

  // Delete Group
  @ApiOkResponse({
    description: 'Boolean',
    type: Boolean,
  })
  @ApiParam({
    name: 'cid',
    description: 'Conversation ID',
    example: '6827da23872f1493c7232389',
  })
  @Delete('group/:cid/delete')
  async deleteGroup(
    @Req() req: Request & { user: string },
    @Param('cid') cid: string,
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
