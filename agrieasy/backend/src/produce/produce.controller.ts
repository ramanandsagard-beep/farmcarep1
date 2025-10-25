import { Body, Controller, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProduceService } from './produce.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
// import { CloudinaryService } from '../common/services/cloudinary.service';

@Controller('produce')
export class ProduceController {
  constructor(private svc: ProduceService /* private cloudinary: CloudinaryService */) {}

  @Get()
  list() {
    return this.svc.list();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.svc.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FARMER')
  create(@Req() req: any, @Body() body: { name: string; price: number; stock: number }) {
    return this.svc.create(req.user.sub, body);
  }

  // Temporarily disabled photo upload endpoints for testing
  /*
  @Post('upload-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FARMER')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: any, @Req() req: any) {
    if (!file) {
      throw new Error('No image file provided');
    }
    const imageUrl = await this.cloudinary.uploadImage(file);
    return {
      success: true,
      imageUrl,
      message: 'Produce image uploaded successfully'
    };
  }

  @Patch(':id/image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FARMER')
  async updateProduceImage(@Param('id') id: string, @Body() body: { imageUrl: string }, @Req() req: any) {
    const produce = await this.svc.findById(id);
    if (!produce || produce.farmerId !== req.user.sub) {
      throw new Error('Produce not found or unauthorized');
    }

    const updatedProduce = await this.svc.updateImageUrl(id, body.imageUrl);
    return {
      success: true,
      produce: updatedProduce,
      message: 'Produce image updated successfully'
    };
  }
  */
}
