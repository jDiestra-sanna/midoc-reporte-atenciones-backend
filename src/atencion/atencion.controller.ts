import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { AtencionService } from './atencion.service';
import * as moment from 'moment';

@Controller('atencion')
export class AtencionController {
  constructor(private service: AtencionService) {}

  /**
   * GET /atencion
   * Permite consultar atenciones por:
   * - Una fecha específica con `date`
   * - Un rango de fechas con `start` y `end`
   */
  @Get()
  async get(
    @Query('date') date?: string,
    @Query('start') start?: string,
    @Query('end') end?: string
  ) {
    if (start && end) {
      return this.service.getByRange(start, end);
    }

    const d = date ? moment(date).toDate() : new Date();
    return this.service.getByDate(d);
  }

  /**
   * POST /atencion/enviar-reporte-excel
   * Recibe `start` y `end` en el body para generar y enviar un archivo Excel por correo
   */
  @Post('enviar-reporte-excel')
  async enviarReporte(@Body() body: { start: string; end: string }) {
    const { start, end } = body;
    return this.service.sendExcelReport(start, end);
  }
}
