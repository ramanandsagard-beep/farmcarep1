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
exports.ProduceController = void 0;
const common_1 = require("@nestjs/common");
const produce_service_1 = require("./produce.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const platform_express_1 = require("@nestjs/platform-express");
const cloudinary_service_1 = require("../common/services/cloudinary.service");
let ProduceController = class ProduceController {
    constructor(svc, cloudinary) {
        this.svc = svc;
        this.cloudinary = cloudinary;
    }
    list() {
        return this.svc.list();
    }
    create(req, body) {
        return this.svc.create(req.user.sub, body);
    }
    async uploadImage(file, req) {
        if (!file) {
            throw new Error('No image file provided');
        }
        const imageUrl = await this.cloudinary.uploadImage(file);
        return { imageUrl };
    }
};
exports.ProduceController = ProduceController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProduceController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('FARMER'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProduceController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('upload-image'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('FARMER'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProduceController.prototype, "uploadImage", null);
exports.ProduceController = ProduceController = __decorate([
    (0, common_1.Controller)('produce'),
    __metadata("design:paramtypes", [produce_service_1.ProduceService, cloudinary_service_1.CloudinaryService])
], ProduceController);
//# sourceMappingURL=produce.controller.js.map