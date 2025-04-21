import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AtencionModule } from './atencion/atencion.module';

@Module({
  imports: [
    // ✅ Carga todas las variables de entorno como globales
    ConfigModule.forRoot({
      isGlobal: true,
      //envFilePath: ['.env'], // ← útil si tu entorno no lo reconoce por defecto
    }),

    ScheduleModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT || 5432),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),

    AtencionModule,
  ],
})
export class AppModule {}
