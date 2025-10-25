import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProduceEntity } from './produce.entity';
import { ProduceService } from './produce.service';
import { ProduceController } from './produce.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProduceEntity]), CommonModule],
  providers: [ProduceService],
  controllers: [ProduceController],
})
export class ProduceModule {}
