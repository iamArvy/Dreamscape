import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UserService } from './user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from './strategies';
import { ConfigModule } from '@nestjs/config';
import { Post, PostSchema } from './app.schema';
import { AppResolver } from './app.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_DB_URL ||
        'mongodb://root:example@localhost:27017/posts?authSource=admin',
    ),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      sortSchema: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, UserService, JwtStrategy, AppResolver],
})
export class AppModule {}
