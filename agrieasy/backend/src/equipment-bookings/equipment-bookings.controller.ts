import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { EquipmentBookingsService } from './equipment-bookings.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('equipment-bookings')
export class EquipmentBookingsController {
  constructor(private svc: EquipmentBookingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FARMER')
  create(@Req() req: any, @Body() body: { equipmentId: string; startTime: string; endTime: string }) {
    return this.svc.create(req.user.sub, body);
  }
}
