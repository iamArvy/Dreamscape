import { JwtAuthGuard } from '../guards/jwt.guard';
import { Body, Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { ParticipantService } from 'src/participant/service';
import { MessageService } from './service';
import { MessageResponse } from './response';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessageController {
  constructor(
    private readonly service: MessageService,
    private readonly participantService: ParticipantService,
  ) {}

  @ApiOkResponse({
    description: 'Array of Conversation Messages',
    type: [MessageResponse],
  })
  @ApiParam({
    name: 'id',
    description: 'Conversation ID',
    example: '6827da23872f1493c7232389',
  })
  @Get('conversation/:cid/messages')
  async getConversionMessages(
    @Req() req: Request & { user: string },
    @Param('cid') cid: string,
  ) {
    await this.participantService.getConversationParticipant(req.user, cid);
    return await this.service.getConversationMessages(req.user, cid);
  }
}
