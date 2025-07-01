import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AUTH_SERVICE_NAME, AuthServiceClient } from 'src/generated/auth';
import {
  EmailInput,
  LoginInput,
  RegisterInput,
  TokenInput,
  UpdatePasswordInput,
} from './dto/auth.input';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/guards';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(@Inject('auth') private client: ClientGrpc) {}
  private authService: AuthServiceClient;
  private logger = new Logger(AuthController.name);

  // private logger: Logger
  onModuleInit() {
    this.authService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  @Get('health')
  health() {
    return this.authService.health({});
  }
  @Post('register')
  register(@Req() req: Request, @Body() data: RegisterInput) {
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ipAddress = req.ip || 'Unknown';
    return this.authService.register({ data, userAgent, ipAddress });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(
    @Req() req: { user: { id: string } },
    @Body() data: UpdatePasswordInput,
  ) {
    return this.authService.changePassword({ id: req.user.id, data });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('change-email')
  changeEmail(@Req() req: { user: { id: string } }, @Body() data: EmailInput) {
    return this.authService.changeEmail({ id: req.user.id, data });
  }

  @Post('request-email-verification')
  requestEmailVerification(@Body() data: EmailInput) {
    return this.authService.requestEmailVerification(data);
  }

  @Post('verify-email')
  verifyEmail(@Body() data: TokenInput) {
    return this.authService.verifyEmail(data);
  }

  @Post('login')
  login(@Req() req: Request, @Body() data: LoginInput) {
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ipAddress = req.ip || 'Unknown';
    try {
      return this.authService.login({ data, userAgent, ipAddress });
    } catch (error) {
      this.logger.log(error as string);
      throw new InternalServerErrorException();
    }
  }

  @Post('refresh-token')
  refreshToken(@Body() data: TokenInput) {
    return this.authService.refreshToken(data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Body() data: TokenInput) {
    return this.authService.logout(data);
  }
}
