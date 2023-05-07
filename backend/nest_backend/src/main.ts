import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: process.env.PRIVATE_KEY,
    cert: process.env.CERTIFICATE,
  };
  const app = await NestFactory.create(AppModule, {
    // httpsOptions,
  });
  await app.listen(3000);
  app.enableCors({
    allowedHeaders: ['content-type'],
    origin: 'http://192.168.10.3:5176',
    credentials: true,
  });
  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true, limit: '5mb' }));
}
bootstrap();
