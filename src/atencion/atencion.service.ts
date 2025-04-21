import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Atencion } from './atencion.entity';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import * as nodemailer from 'nodemailer';
import * as XLSX from 'xlsx';

@Injectable()
export class AtencionService {
  constructor(
    @InjectRepository(Atencion)
    private atencionRepo: Repository<Atencion>,
    private configService: ConfigService
  ) {}

  async getByDate(date: Date) {
    const start = moment(date).startOf('day').toDate();
    const end = moment(date).endOf('day').toDate();

    return this.atencionRepo.find({
      where: {
        clasificacion_pac: 62,
        fec_ate: Between(start, end),
      },
      order: { fec_ate: 'DESC' },
    });
  }

  async getByRange(start: string, end: string) {
    const startDate = new Date(start);
    const endDate = new Date(new Date(end).setHours(23, 59, 59, 999));

    return this.atencionRepo.find({
      where: {
        clasificacion_pac: 62,
        fec_ate: Between(startDate, endDate),
      },
      order: { fec_ate: 'DESC' },
    });
  }

  @Cron('0 6 * * 1') // Cada lunes a las 6am
  async sendWeeklyReport() {
    const start = moment().subtract(7, 'days').startOf('day');
    const end = moment().subtract(1, 'day').endOf('day');
    await this.sendExcelReport(start.toISOString(), end.toISOString());
  }

  async sendExcelReport(start: string, end: string) {
    const data = await this.getByRange(start, end);

    const headers = [
      ['Cod Ate.', 'Estado Ate.', 'Fecha Ate.', 'Paciente', 'Boleta', 'Monto', 'Mét. Pago', 'Num. Operación', 'Convenio']
    ];
    const rows = data.map(row => [
      row.cod_ate,
      row.cm_estado,
      moment(row.fec_ate).format('YYYY-MM-DD'),
      row.nom_pac,
      row.numero_ce,
      row.tar_ate,
      row.for_ate,
      row.num_operacion_ap,
      row.cod_convenio
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([...headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Atenciones');
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    const user = this.configService.get<string>('MAIL_USER');
    const pass = this.configService.get<string>('MAIL_PASS');

    if (!user || !pass) {
      throw new InternalServerErrorException('Credenciales de correo no configuradas correctamente');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });

    await transporter.sendMail({
      from: user,
      to: 'joseph.diestra@sanna.pe, erick.huapaya@sanna.pe, gaby.chirimia@sanna.pe, kati.loayza@sanna.pe, maria.tejada@sanna.pe',
      subject: `Reporte de Atenciones del ${moment(start).format('DD/MM/YYYY')} al ${moment(end).format('DD/MM/YYYY')}`,
      text: 'Adjunto se encuentra el reporte de atenciones en formato Excel.',
      attachments: [
        {
          filename: `reporte_atenciones_${moment(start).format('YYYYMMDD')}_a_${moment(end).format('YYYYMMDD')}.xlsx`,
          content: buffer,
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      ],
    });

    return { status: 'Correo enviado' };
  }
}
