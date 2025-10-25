import { Body, Controller, Get, Patch, Post, Req, UseGuards, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private users: UsersService /* private cloudinary: CloudinaryService */) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: any) {
    const user = await this.users.findById(req.user.sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Body() body: { name?: string; email?: string }, @Req() req: any) {
    const updatedUser = await this.users.updateProfile(req.user.sub, body);
    if (!updatedUser) {
      throw new Error('User not found');
    }

    return {
      success: true,
      user: {
        id: updatedUser.id,
        phone: updatedUser.phone,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt
      }
    };
  }
}
