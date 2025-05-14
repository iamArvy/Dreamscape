import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LoginInput, RegisterInput } from './app.inputs';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}
  @Get('health')
  health() {
    return 'OK';
  }

  @Post('register')
  register(@Body() data: RegisterInput) {
    return this.service.signup(data);
  }

  @Post('login')
  login(@Body() data: LoginInput) {
    return this.service.login(data);
  }

  @Post('refresh-token')
  refreshToken(@Body() data: { refresh_token: string }) {
    return this.service.refreshToken(data.refresh_token);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Request() req: { user: string }) {
    return this.service.logout(req.user);
  }
}
