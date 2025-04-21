import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Atencion } from './atencion.entity';
import { AtencionService } from './atencion.service';
import { AtencionController } from './atencion.controller';

@Module({
  // Importa el repositorio de la entidad Atencion para su uso en el servicio
  imports: [TypeOrmModule.forFeature([Atencion])],
  
  // Registra el servicio que contiene la lógica de negocio
  providers: [AtencionService],
  
  // Registra el controlador para exponer los endpoints HTTP
  controllers: [AtencionController],
})
export class AtencionModule {}
