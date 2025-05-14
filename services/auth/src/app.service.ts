import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginInput, RegisterInput, UpdatePasswordInput } from './app.inputs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from './services/user.service';
import * as argon from 'argon2';
import { AuthResponse } from './app.response';
import { User } from '@prisma/client';

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
    await this.user.update({
      where: { id },
      data: { refresh_token: hashedRefreshToken },
    });
    return {
      access: { token: access_token, expiresIn: 15000 },
      refresh: { token: refresh_token, expiresIn: 24000 },
    };
  }

  async signup(Input: RegisterInput): Promise<AuthResponse> {
    if (!Input) throw new UnauthorizedException('Invalid credentials');
    const exists = await this.user.user({
      where: { email: Input.email },
    });
    if (exists) throw new UnauthorizedException('User already exists');
    const hash = await argon.hash(Input.password);
    const user = await this.user.create({
      email: Input.email,
      password: hash,
    });
    return this.authenticateUser(user.id, user.email);
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    const user = await this.user.user({
      where: { email: data.email },
    });
    if (!user) throw new NotFoundException('User not found');
    await this.compareSecrets(user.password, data.password);
    return this.authenticateUser(user.id, user.email);
  }

  async refreshToken(refresh_token: string): Promise<AuthResponse> {
    const decoded: { sub: string; email: string } = this.jwtService.verify(
      refresh_token,
      {
        secret: this.config.get('REFRESH_SECRET') || '',
      },
    );
    const user = await this.user.user({
      where: { id: decoded.sub },
      // select: { ...this.userService.public, refreshToken: true },
    });

    if (!user || !user.refresh_token)
      throw new UnauthorizedException('Invalid refresh token');
    await this.compareSecrets(user.refresh_token, refresh_token);
    return this.authenticateUser(user.id, user.email);
  }

  async logout(id: string) {
    await this.user.update({
      where: { id: id },
      data: { refresh_token: null },
    });
  }

  async updatePassword(id: string, data: UpdatePasswordInput): Promise<User> {
    const user = await this.user.user({
      where: { id: id },
    });
    if (!user) throw new NotFoundException('User not found');

    const valid = await this.compareSecrets(user.password, data.oldPassword);
    if (!valid) throw new UnauthorizedException('Old password incorrect');

    const hash = await argon.hash(data.newPassword);

    return this.user.update({
      where: { id: id },
      data: {
        password: hash,
      },
    });
  }
}
