import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Atencion } from './atencion.entity';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import * as nodemailer from 'nodemailer';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AtencionService {
  constructor(
    @InjectRepository(Atencion)
    private atencionRepo: Repository<Atencion>,

    private configService: ConfigService
  ) {}

  // Consulta registros por fecha única (día)
  async getByDate(date: Date) {
    const start = moment(date).startOf('day').toDate();
    const end = moment(date).endOf('day').toDate();

    this.writeActivityLog(`Consulta única ejecutada para fecha: ${moment(date).format('YYYY-MM-DD')}`);
    return this.atencionRepo.find({
      where: {
        clasificacion_pac: 62,
        fec_ate: Between(start, end),
      },
      order: { fec_ate: 'DESC' },
    });
  }

  // Consulta registros en un rango de fechas
  async getByRange(start: string, end: string) {
    const startDate = new Date(start);
    const endDate = new Date(new Date(end).setHours(23, 59, 59, 999)); // Incluye todo el último día

    this.writeActivityLog(`Consulta de rango ejecutada: ${start} al ${end}`);
    return this.atencionRepo.find({
      where: {
        clasificacion_pac: 62,
        fec_ate: Between(startDate, endDate),
      },
      order: { fec_ate: 'DESC' },
    });
  }

  // Envío automático diario a las 6am con reporte del día anterior
  @Cron('0 6 * * *')
  async sendDailyReport() {
    const start = moment().subtract(1, 'day').startOf('day');
    const end = moment().subtract(1, 'day').endOf('day');
    await this.sendExcelReport(start.toISOString(), end.toISOString());
  }

  // Envía el Excel por correo según un rango de fechas
  async sendExcelReport(start: string, end: string) {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    const data = await this.getByRange(start, end);

    // Construcción del contenido del Excel
    const headers = [[
      'Cod Ate.', 'Estado Ate.', 'Fecha Ate.', 'Paciente', 'Boleta', 'Monto', 'Mét. Pago', 'Num. Operación', 'Convenio'
    ]];
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

    // Credenciales desde .env
    const user = this.configService.get<string>('MAIL_USER');
    const pass = this.configService.get<string>('MAIL_PASS');

    if (!user || !pass) {
      this.writeActivityLog(`[${timestamp}] ❌ ERROR: Faltan credenciales de correo`);
      this.writeMailLog(`[${timestamp}] ❌ ERROR: Faltan credenciales de correo`);
      throw new InternalServerErrorException('Credenciales de correo no configuradas correctamente');
    }

    const recipients = 'joseph.diestra@sanna.pe, erick.huapaya@sanna.pe, gaby.chirimia@sanna.pe, kati.loayza@sanna.pe, maria.tejada@sanna.pe, bruno.salazar@sanna.pe';

    // ✉️ Configura y envía el correo
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });

    try {
      await transporter.sendMail({
        from: user,
        to: recipients,
        subject: `📊 Reporte de Atenciones - ${moment(start).format('DD/MM/YYYY')}`,
        text: 'Adjunto se encuentra el reporte de atenciones en formato Excel.',
        attachments: [{
          filename: `reporte_atenciones_${moment(start).format('YYYYMMDD')}.xlsx`,
          content: buffer,
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }],
      });

      this.writeMailLog(`[${timestamp}] ✅ CORREO enviado a: ${recipients}`);
      this.writeActivityLog(`[${timestamp}] ✅ ENVÍO de reporte exitoso para el rango ${start} - ${end}`);
    } catch (error) {
      this.writeMailLog(`[${timestamp}] ❌ ERROR al enviar: ${error.message}`);
      this.writeActivityLog(`[${timestamp}] ❌ FALLO en envío de correo: ${error.message}`);
      throw new InternalServerErrorException('Error al enviar el correo');
    }

    return { status: 'Correo enviado' };
  }

  // Log de actividad general (consultas, envíos, errores)
  private writeActivityLog(message: string) {
    const date = moment().format('YYYY-MM-DD');
    const logDir = path.join(__dirname, '..', '..', 'logs', 'activity');
    const logFile = path.join(logDir, `activity-${date}.log`);

    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
    fs.appendFileSync(logFile, `${message}\n`);
  }

  // Log exclusivo para acciones de correo
  private writeMailLog(message: string) {
    const date = moment().format('YYYY-MM-DD');
    const logDir = path.join(__dirname, '..', '..', 'logs', 'mail');
    const logFile = path.join(logDir, `mail-${date}.log`);

    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
    fs.appendFileSync(logFile, `${message}\n`);
  }
}
