import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import Twilio from 'twilio';

@Injectable()
export class AuthService {
  private twilioClient: any;
  private emailTransporter: any;

  constructor(
    private users: UsersService,
    private jwt: JwtService,
    @Inject('REDIS') private redis: any,
  ) {
    // Initialize SMTP for Email
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT || 587;
    const smtpUser = process.env.SMTP_USERNAME;
    const smtpPass = process.env.SMTP_PASSWORD;
    if (smtpHost && smtpUser && smtpPass) {
      this.emailTransporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort.toString()),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
    }

    // Initialize Twilio for SMS
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    if (twilioAccountSid && twilioAuthToken && twilioPhoneNumber) {
      this.twilioClient = Twilio(twilioAccountSid, twilioAuthToken);
    }
  }

  private async checkRateLimit(key: string, limit: number, ttlSeconds: number) {
    const count = await this.redis.incr(key);
    if (count === 1) await this.redis.expire(key, ttlSeconds);
    if (count > limit) {
      throw new UnauthorizedException('Too many requests. Please try again later.');
    }
  }

  async requestOtp(phone?: string, email?: string) {
    const id = phone || email;
    if (!id) throw new UnauthorizedException('Phone or Email is required');
    const kind = phone ? 'phone' : 'email';
    await this.checkRateLimit(`rl:otp:${kind}:${id}`, 5, 300);
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const key = `otp:${kind}:${id}`;
    await this.redis.setex(key, 300, otp);

    // Send OTP via SMS or email
    try {
      if (phone && this.twilioClient) {
        // Send SMS via Twilio
        await this.twilioClient.messages.create({
          body: `Your AgriHub OTP is: ${otp}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone,
        });
      } else if (email && this.emailTransporter) {
        await this.emailTransporter.sendMail({
          from: 'noreply@agrihub.com',
          to: email,
          subject: 'AgriHub OTP Verification',
          text: `Your AgriHub OTP is: ${otp}`,
          html: `<strong>Your AgriHub OTP is: ${otp}</strong>`,
        });
      } else {
        // Fallback for development/testing when external services aren't configured
        console.log(`🔑 DEVELOPMENT OTP for ${kind}:${id}: ${otp}`);
        console.log('📧 In production, this OTP would be sent via SMS or email');
        // Don't throw error, just log and continue
      }
    } catch (error) {
      console.error('Failed to send OTP:', error);
      // For development, don't throw error even if sending fails
      console.log(`🔑 FALLBACK OTP for ${kind}:${id}: ${otp}`);
    }

    return { success: true };
  }

  async resendOtp(phone?: string, email?: string) {
    return this.requestOtp(phone, email);
  }

  async checkUser(phone?: string, email?: string) {
    let user: any = null;
    if (phone) user = await this.users.findByPhone(phone);
    else if (email) user = await this.users.findByEmail(email);
    else throw new UnauthorizedException('Phone or Email is required');

    if (!user) {
      return {
        exists: false,
        needsRegistration: true,
        message: 'New user - please verify with OTP'
      };
    }

    return {
      exists: true,
      hasPassword: !!user.password,
      needsPassword: !user.password,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role
      },
      message: user.password ? 'Existing user - please login with password' : 'User exists but needs password setup'
    };
  }

  async verifyOtp(phone?: string, email?: string, otp?: string, name?: string, role?: any) {
    if (!otp) throw new UnauthorizedException('OTP is required');
    const id = phone || email;
    if (!id) throw new UnauthorizedException('Phone or Email is required');
    const kind = phone ? 'phone' : 'email';
    const key = `otp:${kind}:${id}`;
    const stored = await this.redis.get(key);
    if (!stored || stored !== otp) throw new UnauthorizedException('Invalid OTP');

    // Log successful OTP verification for development
    console.log(`✅ OTP verified successfully for ${kind}:${id}`);

    const user = phone
      ? await this.users.upsertByPhone(phone, name || 'User', role || 'CONSUMER')
      : await this.users.upsertByEmail(email!, name || 'User', role || 'CONSUMER');
    const token = await this.jwt.signAsync({
      sub: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      phone: user.phone
    });
    await this.redis.del(key);
    return { token, needsPassword: !user.password };
  }

  async login(phone?: string, email?: string, password?: string, name?: string) {
    console.log('Login attempt:', { phone, email, name });
    if (!password) throw new UnauthorizedException('Password is required');

    let user: any = null;
    if (phone) {
      user = await this.users.findByPhone(phone);
      console.log('Found user by phone:', user);
    } else if (email) {
      user = await this.users.findByEmail(email);
      console.log('Found user by email:', user);
    } else {
      throw new UnauthorizedException('Phone or Email is required');
    }

    // If user doesn't exist, throw error - don't create new user
    if (!user) {
      console.log('User not found for login:', phone || email);
      throw new UnauthorizedException('Invalid credentials. User not found.');
    }

    console.log('User before password check:', { id: user.id, hasPassword: !!user.password });

    // If user exists but has no password, set one (for backward compatibility)
    if (!user.password) {
      console.log('User has no password, setting it now for user:', user.id);
      await this.setPassword(user.id, password);
      user = await this.users.findById(user.id);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password validation result:', isValidPassword);
    if (!isValidPassword) throw new UnauthorizedException('Invalid password');

    const token = await this.jwt.signAsync({
      sub: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      phone: user.phone
    });
    console.log('Login successful, returning token for user:', user.id);
    return { token, user: { id: user.id, email: user.email, phone: user.phone, name: user.name, role: user.role } };
  }

  async setPassword(userId: string, newPassword: string) {
    if (!newPassword || newPassword.length < 8) {
      throw new UnauthorizedException('Password must be at least 8 characters');
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await this.users.updatePassword(userId, hashed);
    return { success: true };
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.users.findById(userId);
    if (!user || !user.password) throw new UnauthorizedException('User not found');
    const isValidOldPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidOldPassword) throw new UnauthorizedException('Old password is incorrect');
    return this.setPassword(userId, newPassword);
  }

  async requestPasswordReset(phone?: string, email?: string) {
    const id = phone || email;
    if (!id) throw new UnauthorizedException('Phone or Email is required');
    return this.requestOtp(phone, email);
  }

  async resetPassword(phone?: string, email?: string, otp?: string, newPassword?: string) {
    if (!otp || !newPassword) throw new UnauthorizedException('OTP and new password are required');

    const id = phone || email;
    if (!id) throw new UnauthorizedException('Phone or Email is required');

    const kind = phone ? 'phone' : 'email';
    const key = `otp:${kind}:${id}`;
    const stored = await this.redis.get(key);
    if (!stored || stored !== otp) throw new UnauthorizedException('Invalid OTP');

    let user: any = null;
    if (phone) {
      user = await this.users.findByPhone(phone);
    } else if (email) {
      user = await this.users.findByEmail(email);
    }

    if (!user) throw new UnauthorizedException('User not found');

    await this.setPassword(user.id, newPassword);
    await this.redis.del(key);
    return { success: true };
  }
}
