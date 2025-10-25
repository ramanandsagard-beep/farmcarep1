import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InputProductEntity } from './input-product.entity';
import { InputsService } from './inputs.service';
import { InputsController } from './inputs.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([InputProductEntity]), CommonModule],
  providers: [InputsService],
  controllers: [InputsController],
})
export class InputsModule {}
