import { Body, Controller, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
// import { CloudinaryService } from '../common/services/cloudinary.service';

@Controller('equipment')
export class EquipmentController {
  constructor(private svc: EquipmentService /* private cloudinary: CloudinaryService */) {}

  @Get()
  list() {
    return this.svc.list();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.get(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EQUIPMENT_VENDOR')
  create(@Req() req: any, @Body() body: { name: string; description?: string; pricePerDay: number }) {
    return this.svc.create(req.user.sub, body);
  }

  // Temporarily disabled photo upload endpoints for testing
  /*
  @Post('upload-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EQUIPMENT_VENDOR')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: any, @Req() req: any) {
    if (!file) {
      throw new Error('No image file provided');
    }
    const imageUrl = await this.cloudinary.uploadImage(file);
    return {
      success: true,
      imageUrl,
      message: 'Equipment image uploaded successfully'
    };
  }

  @Patch(':id/image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EQUIPMENT_VENDOR')
  async updateEquipmentImage(@Param('id') id: string, @Body() body: { imageUrl: string }, @Req() req: any) {
    const equipment = await this.svc.findById(id);
    if (!equipment || equipment.vendorId !== req.user.sub) {
      throw new Error('Equipment not found or unauthorized');
    }

    const updatedEquipment = await this.svc.updateImageUrl(id, body.imageUrl);
    return {
      success: true,
      equipment: updatedEquipment,
      message: 'Equipment image updated successfully'
    };
  }
  */
}
