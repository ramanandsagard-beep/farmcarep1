import { BadRequestException, Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './services/cloudinary.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    role: string;
  };
}

@Controller('upload')
export class UploadController {
  constructor(private cloudinary: CloudinaryService) {}

  @Post('profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadProfileImage(@UploadedFile() file: any, @Req() req: AuthenticatedRequest) {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    const imageUrl = await this.cloudinary.uploadImage(file);
    return {
      success: true,
      imageUrl,
      message: 'Profile image uploaded successfully'
    };
  }

  @Post('equipment')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EQUIPMENT_VENDOR')
  @UseInterceptors(FileInterceptor('image'))
  async uploadEquipmentImage(@UploadedFile() file: any, @Req() req: AuthenticatedRequest) {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    const imageUrl = await this.cloudinary.uploadImage(file);
    return {
      success: true,
      imageUrl,
      message: 'Equipment image uploaded successfully'
    };
  }

  @Post('input-product')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('INPUT_SUPPLIER')
  @UseInterceptors(FileInterceptor('image'))
  async uploadInputProductImage(@UploadedFile() file: any, @Req() req: AuthenticatedRequest) {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    const imageUrl = await this.cloudinary.uploadImage(file);
    return {
      success: true,
      imageUrl,
      message: 'Input product image uploaded successfully'
    };
  }

  @Post('produce')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FARMER')
  @UseInterceptors(FileInterceptor('image'))
  async uploadProduceImage(@UploadedFile() file: any, @Req() req: AuthenticatedRequest) {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    const imageUrl = await this.cloudinary.uploadImage(file);
    return {
      success: true,
      imageUrl,
      message: 'Produce image uploaded successfully'
    };
  }

  @Post('vehicle')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TRANSPORTER')
  @UseInterceptors(FileInterceptor('image'))
  async uploadVehicleImage(@UploadedFile() file: any, @Req() req: AuthenticatedRequest) {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    const imageUrl = await this.cloudinary.uploadImage(file);
    return {
      success: true,
      imageUrl,
      message: 'Vehicle image uploaded successfully'
    };
  }

  @Post('document')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('document'))
  async uploadDocument(@UploadedFile() file: any, @Req() req: AuthenticatedRequest) {
    if (!file) {
      throw new BadRequestException('No document file provided');
    }

    const imageUrl = await this.cloudinary.uploadImage(file);
    return {
      success: true,
      imageUrl,
      message: 'Document uploaded successfully'
    };
  }
}
