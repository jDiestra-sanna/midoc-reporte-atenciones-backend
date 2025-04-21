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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Atencion = void 0;
const typeorm_1 = require("typeorm");
let Atencion = class Atencion {
    cod_ate;
    cm_estado;
    fec_ate;
    nom_pac;
    numero_ce;
    tar_ate;
    for_ate;
    num_operacion_ap;
    cod_convenio;
    clasificacion_pac;
};
exports.Atencion = Atencion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Atencion.prototype, "cod_ate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Atencion.prototype, "cm_estado", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Atencion.prototype, "fec_ate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Atencion.prototype, "nom_pac", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Atencion.prototype, "numero_ce", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal'),
    __metadata("design:type", Number)
], Atencion.prototype, "tar_ate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Atencion.prototype, "for_ate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Atencion.prototype, "num_operacion_ap", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Atencion.prototype, "cod_convenio", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Atencion.prototype, "clasificacion_pac", void 0);
exports.Atencion = Atencion = __decorate([
    (0, typeorm_1.Entity)('t_tmpllamadas')
], Atencion);
//# sourceMappingURL=atencion.entity.js.map