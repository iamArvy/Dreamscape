import { User } from './user/user.schema';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginInput, RegisterInput, UpdatePasswordInput } from './app.inputs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user/user.service';
import * as argon from 'argon2';
import { AuthResponse } from './app.response';

@Injectable()
export class AppService {
  constructor(
    private user: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async compareSecrets(hash: string, secret: string): Promise<boolean> {
    const valid = await argon.verify(hash, secret);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    return true;
  }

  private async generateToken(
    sub: string,
    email: string,
    type: 'refresh' | 'access',
  ): Promise<string> {
    const payload = { sub, email };
    const secret: string =
      this.config.get(type === 'refresh' ? 'REFRESH_SECRET' : 'JWT_SECRET') ||
      '';
    console.log('secret', secret);
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: type === 'refresh' ? '7d' : '15m',
      secret: secret,
    });
    return token;
  }

  private async authenticateUser(id: string, email: string) {
    const access_token = await this.generateToken(id, email, 'access');
    const refresh_token = await this.generateToken(id, email, 'refresh');

    const hashedRefreshToken = await argon.hash(refresh_token);
    await this.user.updateRefreshToken(id, hashedRefreshToken);
    return {
      access: { token: access_token, expiresIn: 15000 },
      refresh: { token: refresh_token, expiresIn: 24000 },
    };
  }

  async signup(data: RegisterInput): Promise<AuthResponse> {
    if (!data) throw new UnauthorizedException('Invalid credentials');
    const exists = await this.user.findByEmail(data.email);
    if (exists) throw new UnauthorizedException('User already exists');
    const hash = await argon.hash(data.password);
    const user = await this.user.create(data.email, hash);
    return this.authenticateUser(user.id as string, user.email);
  }

  async login(data: LoginInput) {
    const user = await this.user.findByEmailWithPassword(data.email);
    console.log(user);
    if (!user) throw new UnauthorizedException('User not found');
    await this.compareSecrets(user.password, data.password);
    return this.authenticateUser(user.id as string, user.email);
  }

  async refreshToken(refresh_token: string): Promise<AuthResponse> {
    const { sub }: { sub: string } = this.jwtService.verify(refresh_token, {
      secret: this.config.get('REFRESH_SECRET') || '',
    });

    const user = await this.user.find(sub);
    if (!user || !user.refresh_token)
      throw new UnauthorizedException('Invalid refresh token');
    await this.compareSecrets(user.refresh_token, refresh_token);
    return this.authenticateUser(user.id as string, user.email);
  }

  async logout(id: string) {
    await this.user.updateRefreshToken(id, null);
  }

  async updatePassword(id: string, data: UpdatePasswordInput): Promise<User> {
    const user = await this.user.find(id);
    if (!user) throw new NotFoundException('User not found');

    const valid = await this.compareSecrets(user.password, data.oldPassword);
    if (!valid) throw new UnauthorizedException('Old password incorrect');

    const hash = await argon.hash(data.newPassword);

    user.password = hash;
    return await user.save();
  }
}
