import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(private dataSource: DataSource) {}

  async analytics() {
    const q = async (sql: string) => (await this.dataSource.query(sql))[0].count as string;
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
}
