import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config(); // Carga variables de entorno desde .env
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Permite solicitudes desde el frontend
  await app.listen(3000); // Inicia el servidor en el puerto 3000
}
bootstrap();
