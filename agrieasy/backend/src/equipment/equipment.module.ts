import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipmentEntity } from './equipment.entity';
import { EquipmentService } from './equipment.service';
import { EquipmentController } from './equipment.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([EquipmentEntity]), CommonModule],
  providers: [EquipmentService],
  controllers: [EquipmentController],
  exports: [TypeOrmModule, EquipmentService],
})
export class EquipmentModule {}
