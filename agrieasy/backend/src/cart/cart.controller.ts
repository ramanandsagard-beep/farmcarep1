import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CartService } from './cart.service';
import { UsersService } from '../users/users.service';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private svc: CartService, private users: UsersService) {}

  @Get()
  async list(@Req() req: any) {
    // Ensure user exists in database
    let user = await this.users.findById(req.user.sub);
    if (!user) {
      // Create user if doesn't exist (for demo purposes)
      user = await this.users.upsertByEmail(req.user.email || req.user.phone, req.user.name, req.user.role);
    }
    return this.svc.list(user.id);
  }

  @Post()
  async add(@Req() req: any, @Body() body: { itemType: 'INPUT'|'PRODUCE'; itemId: string; quantity: number }) {
    // Ensure user exists in database
    let user = await this.users.findById(req.user.sub);
    if (!user) {
      // Create user if doesn't exist (for demo purposes)
      user = await this.users.upsertByEmail(req.user.email || req.user.phone, req.user.name, req.user.role);
    }

    return this.svc.add(user.id, body.itemType, body.itemId, body.quantity);
  }
}
