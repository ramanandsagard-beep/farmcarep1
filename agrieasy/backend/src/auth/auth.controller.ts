import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SetPasswordDto } from './dto/set-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('request-otp')
  requestOtp(@Body() dto: RequestOtpDto) {
    return this.auth.requestOtp(dto.phone, dto.email);
  }

  @Post('resend-otp')
  resendOtp(@Body() dto: RequestOtpDto) {
    return this.auth.resendOtp(dto.phone, dto.email);
  }

  @Post('verify-otp')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.auth.verifyOtp(dto.phone, dto.email, dto.otp, dto.name, dto.role);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.phone, dto.email, dto.password, dto.name);
  }

  @Post('check-user')
  checkUser(@Body() dto: RequestOtpDto) {
    return this.auth.checkUser(dto.phone, dto.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('set-password')
  setPassword(@Req() req: any, @Body() dto: SetPasswordDto) {
    return this.auth.setPassword(req.user.sub, dto.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    return this.auth.changePassword(req.user.sub, dto.oldPassword, dto.newPassword);
  }

  @Post('reset-password/request')
  requestReset(@Body() dto: ResetPasswordRequestDto) {
    return this.auth.requestPasswordReset(dto.phone, dto.email);
  }

  @Post('reset-password/confirm')
  confirmReset(@Body() dto: any) {
    // expecting { phone, email, otp, newPassword }
    return this.auth.resetPassword(dto.phone, dto.email, dto.otp, dto.newPassword);
  }
}
