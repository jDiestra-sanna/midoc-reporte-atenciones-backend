import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AtencionModule } from './atencion/atencion.module';

@Module({
  imports: [
    /**
     * Carga las variables del archivo .env y las hace accesibles desde cualquier servicio
     */
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: ['.env'],
    }),

    /**
     * Habilita programación de tareas CRON.
     * Necesario para ejecutar tareas periódicas como envío de correos.
     */
    ScheduleModule.forRoot(),

    /**
     * 🛢 Configuración de conexión a la base de datos PostgreSQL
     * Se toma la configuración desde el archivo .env (DB_HOST, DB_PORT, etc.)
     */
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT || 5432),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Autoimporta todas las entidades del proyecto
      synchronize: false, // ⚠️ ¡No activar en producción! Evita que TypeORM modifique la BD automáticamente
    }),

    /**
     * Importa el módulo principal de negocio donde está la lógica de atenciones
     */
    AtencionModule,
  ],
})
export class AppModule {}
