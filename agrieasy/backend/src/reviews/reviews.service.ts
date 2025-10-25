import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewEntity } from './review.entity';

@Injectable()
export class ReviewsService {
  constructor(@InjectRepository(ReviewEntity) private repo: Repository<ReviewEntity>) {}

  create(userId: string, data: { entityType: ReviewEntity['entityType']; entityId: string; rating: number; comment?: string }) {
    const r = this.repo.create({ userId, entityType: data.entityType, entityId: data.entityId, rating: data.rating, comment: data.comment });
    return this.repo.save(r);
  }
}
