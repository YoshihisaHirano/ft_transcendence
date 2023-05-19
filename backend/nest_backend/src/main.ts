import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';


async function bootstrap() {
  const httpsOptions = {
    key: process.env.PRIVATE_KEY,
    cert: process.env.CERTIFICATE,
  };
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: ['content-type'],
    origin: ['http://192.168.10.9:5176', 'http://localhost:5176'],
    credentials: true,
  });
  app.use(json({limit: "50mb" }));
  app.use(urlencoded({limit: "50mb", extended: true}));
  app.useGlobalPipes(new ValidationPipe());
  app.listen(3000, "0.0.0.0");
}
bootstrap();
