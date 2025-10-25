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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let AdminService = class AdminService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async analytics() {
        const q = async (sql) => (await this.dataSource.query(sql))[0].count;
        const users = await q('SELECT COUNT(*)::int as count FROM users');
        const equipment = await q('SELECT COUNT(*)::int as count FROM equipment');
        const inputs = await q('SELECT COUNT(*)::int as count FROM input_products');
        const produce = await q('SELECT COUNT(*)::int as count FROM produce');
        const vehicles = await q('SELECT COUNT(*)::int as count FROM vehicles');
        const orders = await q('SELECT COUNT(*)::int as count FROM orders');
        const bookings = await q('SELECT COUNT(*)::int as count FROM equipment_bookings');
        const reviews = await q('SELECT COUNT(*)::int as count FROM reviews');
        const payments = await q('SELECT COUNT(*)::int as count FROM payments');
        const notifications = await q('SELECT COUNT(*)::int as count FROM notifications');
        return {
            users: Number(users),
            equipment: Number(equipment),
            inputs: Number(inputs),
            produce: Number(produce),
            vehicles: Number(vehicles),
            orders: Number(orders),
            bookings: Number(bookings),
            reviews: Number(reviews),
            payments: Number(payments),
            notifications: Number(notifications),
            userRoles: await this.getUserRoles(),
            orderStatuses: await this.getOrderStatuses(),
            recentActivity: await this.getRecentActivity(),
        };
    }
    async getUserRoles() {
        const result = await this.dataSource.query(`
      SELECT role, COUNT(*)::int as count FROM users GROUP BY role
    `);
        return result;
    }
    async getOrderStatuses() {
        const result = await this.dataSource.query(`
      SELECT status, COUNT(*)::int as count FROM orders GROUP BY status
    `);
        return result;
    }
    async getRecentActivity() {
        const result = await this.dataSource.query(`
      SELECT 'order' as type, created_at FROM orders ORDER BY created_at DESC LIMIT 5
      UNION ALL
      SELECT 'booking' as type, created_at FROM equipment_bookings ORDER BY created_at DESC LIMIT 5
      UNION ALL
      SELECT 'review' as type, created_at FROM reviews ORDER BY created_at DESC LIMIT 5
      ORDER BY created_at DESC LIMIT 10
    `);
        return result;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], AdminService);
//# sourceMappingURL=admin.service.js.map