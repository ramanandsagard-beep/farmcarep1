import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { UsersService } from '../users/users.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private svc: OrdersService, private users: UsersService) {}

  @Post('checkout')
  async checkout(@Req() req: any) {
    // Ensure user exists in database
    let user = await this.users.findById(req.user.sub);
    if (!user) {
      // Create user if doesn't exist (for demo purposes)
      user = await this.users.upsertByEmail(req.user.email || req.user.phone, req.user.name, req.user.role);
    }

    return this.svc.checkout(user.id);
  }

  @Get(':id')
  get(@Param('id') id: string) { return this.svc.getById(id); }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'TRANSPORTER')
  updateStatus(@Param('id') id: string, @Body() body: { status: 'SHIPPED'|'DELIVERED'|'CANCELLED' }) {
    return this.svc.updateStatus(id, body.status);
  }
}
