"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtencionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const atencion_entity_1 = require("./atencion.entity");
const atencion_service_1 = require("./atencion.service");
const atencion_controller_1 = require("./atencion.controller");
let AtencionModule = class AtencionModule {
};
exports.AtencionModule = AtencionModule;
exports.AtencionModule = AtencionModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([atencion_entity_1.Atencion])],
        providers: [atencion_service_1.AtencionService],
        controllers: [atencion_controller_1.AtencionController],
    })
], AtencionModule);
//# sourceMappingURL=atencion.module.js.map