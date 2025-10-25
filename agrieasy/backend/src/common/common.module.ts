import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { CloudinaryService } from './services/cloudinary.service';
// import { UploadModule } from './upload.module';
// import { UploadController } from './upload.controller';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    // UploadModule, // Temporarily disabled for testing
  ],
  controllers: [
    // UploadController, // Temporarily disabled for testing
  ],
  providers: [CloudinaryService],
  exports: [CloudinaryService /* UploadModule */],
})
export class CommonModule {}
