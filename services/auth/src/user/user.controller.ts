import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards';

@Controller()
export class UserController {
  constructor(private readonly service: UserService) {}
  @Get('health')
  health() {
    return 'OK';
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('me')
  getUser(@Req() req: Request & { user: { id: string; email: string } }) {
    return this.service.find(req.user.id);
  }
}
