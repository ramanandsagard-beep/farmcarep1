"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const input_product_entity_1 = require("./input-product.entity");
const inputs_service_1 = require("./inputs.service");
const inputs_controller_1 = require("./inputs.controller");
const common_module_1 = require("../common/common.module");
let InputsModule = class InputsModule {
};
exports.InputsModule = InputsModule;
exports.InputsModule = InputsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([input_product_entity_1.InputProductEntity]), common_module_1.CommonModule],
        providers: [inputs_service_1.InputsService],
        controllers: [inputs_controller_1.InputsController],
    })
], InputsModule);
//# sourceMappingURL=inputs.module.js.map