import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config(); // 👈 Carga las variables del archivo .env
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Permite que el frontend pueda hacer llamadas
  await app.listen(3000);
}
bootstrap();
