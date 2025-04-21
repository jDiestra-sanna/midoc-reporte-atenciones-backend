"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtencionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const atencion_entity_1 = require("./atencion.entity");
const schedule_1 = require("@nestjs/schedule");
const config_1 = require("@nestjs/config");
const moment = require("moment");
const nodemailer = require("nodemailer");
const XLSX = require("xlsx");
let AtencionService = class AtencionService {
    atencionRepo;
    configService;
    constructor(atencionRepo, configService) {
        this.atencionRepo = atencionRepo;
        this.configService = configService;
    }
    async getByDate(date) {
        const start = moment(date).startOf('day').toDate();
        const end = moment(date).endOf('day').toDate();
        return this.atencionRepo.find({
            where: {
                clasificacion_pac: 62,
                fec_ate: (0, typeorm_2.Between)(start, end),
            },
            order: { fec_ate: 'DESC' },
        });
    }
    async getByRange(start, end) {
        const startDate = new Date(start);
        const endDate = new Date(new Date(end).setHours(23, 59, 59, 999));
        return this.atencionRepo.find({
            where: {
                clasificacion_pac: 62,
                fec_ate: (0, typeorm_2.Between)(startDate, endDate),
            },
            order: { fec_ate: 'DESC' },
        });
    }
    async sendWeeklyReport() {
        const start = moment().subtract(7, 'days').startOf('day');
        const end = moment().subtract(1, 'day').endOf('day');
        await this.sendExcelReport(start.toISOString(), end.toISOString());
    }
    async sendExcelReport(start, end) {
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
        const user = this.configService.get('MAIL_USER');
        const pass = this.configService.get('MAIL_PASS');
        if (!user || !pass) {
            throw new common_1.InternalServerErrorException('Credenciales de correo no configuradas correctamente');
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
};
exports.AtencionService = AtencionService;
__decorate([
    (0, schedule_1.Cron)('0 6 * * 1'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AtencionService.prototype, "sendWeeklyReport", null);
exports.AtencionService = AtencionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(atencion_entity_1.Atencion)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], AtencionService);
//# sourceMappingURL=atencion.service.js.map