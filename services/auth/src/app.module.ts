import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.DB_URL ||
        'mongodb://root:example@localhost:27017/auth?authSource=admin',
    ),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '1h' },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
  ],
  controllers: [AppController, UserController],
  providers: [JwtStrategy, AppService],
})
export class AppModule {}
