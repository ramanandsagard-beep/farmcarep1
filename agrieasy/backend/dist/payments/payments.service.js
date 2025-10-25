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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("./payment.entity");
const orders_service_1 = require("../orders/orders.service");
const typeorm_3 = require("@nestjs/typeorm");
const typeorm_4 = require("typeorm");
let PaymentsService = class PaymentsService {
    constructor(repo, orders, dataSource) {
        this.repo = repo;
        this.orders = orders;
        this.dataSource = dataSource;
    }
    async mockPay(orderId) {
        const order = await this.orders.getById(orderId);
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        await this.dataSource.transaction(async (manager) => {
            await manager.update('orders', { id: orderId }, { status: 'PAID' });
            await manager.insert('payments', { order_id: orderId, provider: 'RAZORPAY_MOCK', status: 'PAID', amount: order.totalAmount });
        });
        return { success: true };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.PaymentEntity)),
    __param(2, (0, typeorm_3.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        orders_service_1.OrdersService,
        typeorm_4.DataSource])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map