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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("./notification.entity");
let NotificationsService = class NotificationsService {
    constructor(repo) {
        this.repo = repo;
    }
    list(userId) { return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } }); }
    async send(userId, title, message, type = 'PUSH') {
        const notification = this.repo.create({ userId, title, message, type });
        await this.repo.save(notification);
        if (type === 'SMS') {
            console.log(`Mock SMS sent to user ${userId}: ${message}`);
        }
        else if (type === 'EMAIL') {
            console.log(`Mock Email sent to user ${userId}: ${title} - ${message}`);
        }
        else {
            console.log(`Push notification for user ${userId}: ${title} - ${message}`);
        }
        return notification;
    }
    markAsRead(id) {
        return this.repo.update(id, { isRead: true });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.NotificationEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map