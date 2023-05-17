import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const httpsOptions = {
    key: process.env.PRIVATE_KEY,
    cert: process.env.CERTIFICATE,
  };
  const app = await NestFactory.create(AppModule);
  await app.listen(3000, "0.0.0.0");
  app.enableCors({
    allowedHeaders: ['content-type'],
    origin: ['http://192.168.10.9:5176', 'http://localhost:5176'],
    credentials: true,
  });
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.useGlobalPipes(new ValidationPipe());
}
bootstrap();
