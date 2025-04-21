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
exports.AtencionController = void 0;
const common_1 = require("@nestjs/common");
const atencion_service_1 = require("./atencion.service");
const moment = require("moment");
let AtencionController = class AtencionController {
    service;
    constructor(service) {
        this.service = service;
    }
    async get(date, start, end) {
        if (start && end) {
            return this.service.getByRange(start, end);
        }
        const d = date ? moment(date).toDate() : new Date();
        return this.service.getByDate(d);
    }
    async enviarReporte(body) {
        const { start, end } = body;
        return this.service.sendExcelReport(start, end);
    }
};
exports.AtencionController = AtencionController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, common_1.Query)('start')),
    __param(2, (0, common_1.Query)('end')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AtencionController.prototype, "get", null);
__decorate([
    (0, common_1.Post)('enviar-reporte-excel'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AtencionController.prototype, "enviarReporte", null);
exports.AtencionController = AtencionController = __decorate([
    (0, common_1.Controller)('atencion'),
    __metadata("design:paramtypes", [atencion_service_1.AtencionService])
], AtencionController);
//# sourceMappingURL=atencion.controller.js.map