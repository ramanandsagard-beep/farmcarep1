import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { TransportService } from './transport.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('transport-bookings')
export class TransportController {
  constructor(private svc: TransportService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FARMER')
  create(@Req() req: any, @Body() body: { vehicleId: string; source: string; destination: string; pickupTime: string; dropTime: string }) {
    return this.svc.create(req.user.sub, body);
  }
}
