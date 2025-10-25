import { Body, Controller, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
// import { CloudinaryService } from '../common/services/cloudinary.service';

@Controller('vehicles')
export class VehiclesController {
  constructor(private svc: VehiclesService /* private cloudinary: CloudinaryService */) {}

  @Get()
  list() {
    return this.svc.list();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TRANSPORTER')
  create(@Req() req: any, @Body() body: { vehicleType: string; capacityKg: number; plateNumber: string }) {
    return this.svc.create(req.user.sub, body);
  }

  // Temporarily disabled photo upload endpoints for testing
  /*
  @Post('upload-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TRANSPORTER')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: any, @Req() req: any) {
    if (!file) {
      throw new Error('No image file provided');
    }
    const imageUrl = await this.cloudinary.uploadImage(file);
    return {
      success: true,
      imageUrl,
      message: 'Vehicle image uploaded successfully'
    };
  }

  @Patch(':id/image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TRANSPORTER')
  async updateVehicleImage(@Param('id') id: string, @Body() body: { imageUrl: string }, @Req() req: any) {
    const vehicle = await this.svc.findById(id);
    if (!vehicle || vehicle.transporterId !== req.user.sub) {
      throw new Error('Vehicle not found or unauthorized');
    }

    const updatedVehicle = await this.svc.updateImageUrl(id, body.imageUrl);
    return {
      success: true,
      vehicle: updatedVehicle,
      message: 'Vehicle image updated successfully'
    };
  }
  */
}
