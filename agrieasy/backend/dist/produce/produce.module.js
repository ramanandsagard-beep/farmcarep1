"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProduceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const produce_entity_1 = require("./produce.entity");
const produce_service_1 = require("./produce.service");
const produce_controller_1 = require("./produce.controller");
const common_module_1 = require("../common/common.module");
let ProduceModule = class ProduceModule {
};
exports.ProduceModule = ProduceModule;
exports.ProduceModule = ProduceModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([produce_entity_1.ProduceEntity]), common_module_1.CommonModule],
        providers: [produce_service_1.ProduceService],
        controllers: [produce_controller_1.ProduceController],
    })
], ProduceModule);
//# sourceMappingURL=produce.module.js.map