// auth/ws-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Socket } from 'socket.io'; // 👈 Explicit import

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const handshake = client.handshake;

    const tokenFromAuth =
      typeof handshake.auth?.token === 'string' ? handshake.auth.token : null;

    const authHeader = handshake.headers?.authorization;
    const tokenFromHeader =
      typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;

    const token = tokenFromAuth || tokenFromHeader;
    if (!token) throw new UnauthorizedException('Missing token');

    const logger = new Logger(WsAuthGuard.name);

    try {
      const { sub } = this.jwtService.verify<{ sub: string }>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      client.data = sub;
      return true;
    } catch (e) {
      logger.error(
        'JWT verification failed',
        e instanceof Error ? e.stack : String(e),
      );
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
