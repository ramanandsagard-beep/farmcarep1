import { Body, Controller, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { InputsService } from './inputs.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
// import { CloudinaryService } from '../common/services/cloudinary.service';

@Controller('inputs')
export class InputsController {
  constructor(private svc: InputsService /* private cloudinary: CloudinaryService */) {}

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
  @Roles('INPUT_SUPPLIER')
  create(@Req() req: any, @Body() body: { name: string; category: 'FERTILIZER'|'PESTICIDE'|'OTHER'; price: number; stock: number }) {
    return this.svc.create(req.user.sub, body);
  }

  // Temporarily disabled photo upload endpoints for testing
  /*
  @Post('upload-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('INPUT_SUPPLIER')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: any, @Req() req: any) {
    if (!file) {
      throw new Error('No image file provided');
    }
    const imageUrl = await this.cloudinary.uploadImage(file);
    return {
      success: true,
      imageUrl,
      message: 'Input product image uploaded successfully'
    };
  }

  @Patch(':id/image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('INPUT_SUPPLIER')
  async updateProductImage(@Param('id') id: string, @Body() body: { imageUrl: string }, @Req() req: any) {
    const product = await this.svc.findById(id);
    if (!product || product.supplierId !== req.user.sub) {
      throw new Error('Product not found or unauthorized');
    }

    const updatedProduct = await this.svc.updateImageUrl(id, body.imageUrl);
    return {
      success: true,
      product: updatedProduct,
      message: 'Product image updated successfully'
    };
  }
  */
}
