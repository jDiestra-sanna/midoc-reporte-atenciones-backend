import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Atencion } from './atencion.entity';
import { AtencionService } from './atencion.service';
import { AtencionController } from './atencion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Atencion])],
  providers: [AtencionService],
  controllers: [AtencionController],
})
export class AtencionModule {}
