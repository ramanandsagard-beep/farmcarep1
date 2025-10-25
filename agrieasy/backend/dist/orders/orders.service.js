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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./order.entity");
const order_item_entity_1 = require("./order-item.entity");
const cart_service_1 = require("../cart/cart.service");
let OrdersService = class OrdersService {
    constructor(orders, orderItems, cart) {
        this.orders = orders;
        this.orderItems = orderItems;
        this.cart = cart;
    }
    async checkout(userId) {
        const cartItems = await this.cart.list(userId);
        let total = 0;
        const order = await this.orders.save(this.orders.create({ userId, status: 'CREATED', totalAmount: '0' }));
        for (const ci of cartItems) {
            const price = 100;
            total += price * ci.quantity;
            await this.orderItems.save(this.orderItems.create({ orderId: order.id, itemType: ci.itemType, itemId: ci.itemId, quantity: ci.quantity, price: String(price) }));
        }
        order.totalAmount = String(total);
        await this.orders.save(order);
        await this.cart.clear(userId);
        return order;
    }
    getById(id) { return this.orders.findOne({ where: { id } }); }
    async updateStatus(id, status) {
        const order = await this.getById(id);
        if (!order)
            return null;
        order.status = status;
        await this.orders.save(order);
        return order;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.OrderEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItemEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        cart_service_1.CartService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map