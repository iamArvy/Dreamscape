import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    // private user: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') || 'defaultSecret',
    });
  }

  validate({ sub, email }: { sub: string; email: string }) {
    // If you want to check if the user exists, uncomment this
    // const user = await this.user.user({
    //   where: { user_id: sub },
    // });
    // if (!user) throw new UnauthorizedException('User not found');
    return { id: sub, email };
  }
}
