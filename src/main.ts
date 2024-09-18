import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: process.env.ENABLED_URL,
    credentials: true,
  });

  await app.listen(parseInt(process.env.SERVER_PORT, 10) || 8000);
}
bootstrap();
