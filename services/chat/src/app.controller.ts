import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { AppService } from './app.service';
import { User } from 'types';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @Post('chat/new')
  async startNewConversation(
    @Req() req: Request & { user: User },
    @Body('user') user: User,
  ) {
    const users = [req.user, user];
    return await this.service.startNewConversation(users);
  }

  @Post('group/create')
  async createGroup(
    @Req() req: Request & { user: User },
    @Body('users') users: User[],
  ) {
    return await this.service.createGroup(req.user, users);
  }

  // @UseGuards(PermissionsGuard)
  // @Permission('canAddParticipant')
  @Patch('group/:cid/add/:uid')
  async addUserToGroup(
    @Req() req: Request & { user: string },
    @Param('cid') cid: string,
    @Param('uid') uid: User,
  ) {
    return await this.service.addUserToGroup(req.user, cid, uid);
  }

  @Get('conversations')
  async getConversations(@Req() req: Request & { user: string }) {
    return await this.service.getUserConversations(req.user);
  }

  @Get('chat/:cid')
  async getConversion(
    @Req() req: Request & { user: string },
    @Param('cid') cid: string,
  ) {
    return await this.service.getConversation(req.user, cid);
  }

  @Get('conversation/:cid/messages')
  async getConversionMessages(
    @Req() req: Request & { user: string },
    @Param('cid') cid: string,
  ) {
    return await this.service.getConversationMessages(req.user, cid);
  }

  @Get('group/:cid/participants')
  async getConversationParticipants(
    @Req() req: Request & { user: string },
    @Param('cid') cid: string,
  ) {
    return await this.service.getConversationParticipants(req.user, cid);
  }

  @Delete('group/:cid/remove/:pid')
  async removeUserFromGroup(
    @Req() req: Request & { user: string },
    @Param('cid') cid: string,
    @Param('pid') pid: string,
  ) {
    return await this.service.removeUserFromGroup(req.user, cid, pid);
  }

  @Delete('user/leave/:cid')
  async leaveGroup(
    @Req() req: Request & { user: string },
    @Param('cid') cid: string,
  ) {
    await this.service.leaveGroup(req.user, cid);
    return true;
  }

  @Delete('group/:cid/delete')
  async deleteGroup(
    @Req() req: Request & { user: string },
    @Param('cid') cid: string,
  ) {
    await this.service.deleteGroup(req.user, cid);
    return true;
  }

  @Patch('group/:cid/make_admin/:pid')
  async makeAdmin(
    @Req() req: Request & { user: string },
    @Param('cid') cid: string,
    @Param('pid') pid: string,
  ) {
    await this.service.makeAdmin(req.user, cid, pid);
    return true;
  }

  @Patch('group/:cid/remove_admin/:pid')
  async removeAdmin(
    @Req() req: Request & { user: string },
    @Param('cid') cid: string,
    @Param('pid') pid: string,
  ) {
    await this.service.makeAdmin(req.user, cid, pid);
    return true;
  }

  @Patch('group/:cid/change_ownership/:pid')
  async changeOwnership(
    @Req() req: Request & { user: string },
    @Param('cid') cid: string,
    @Param('pid') pid: string,
  ) {
    await this.service.changeOwnership(req.user, cid, pid);
    return true;
  }
}
