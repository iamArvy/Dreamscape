// import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// import { User } from '@prisma/client';

export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
