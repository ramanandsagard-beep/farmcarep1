import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(private svc: ReviewsService) {}

  @Post()
  create(@Req() req: any, @Body() body: { entityType: 'EQUIPMENT'|'INPUT'|'PRODUCE'|'VEHICLE'|'ORDER'; entityId: string; rating: number; comment?: string }) {
    return this.svc.create(req.user.sub, body);
  }
}
