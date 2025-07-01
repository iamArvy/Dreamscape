import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'chat',
        protoPath: 'proto/chat.proto',
        url: process.env.GRPC_URL ?? undefined,
        // loader: {
        //   arrays: true,
        //   objects: true,
        //   includeDirs: ['proto'],
        //   keepCase: true,
        //   longs: String,
        //   defaults: true,
        //   oneofs: true,
        //   enums: String,
        // },
      },
    },
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true,
      // transform: true,
      // transformOptions: {
      //   enableImplicitConversion: true,
      // }
    }),
  );

  await app.listen();
}
bootstrap();
