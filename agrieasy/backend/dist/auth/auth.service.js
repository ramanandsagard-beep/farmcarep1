"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const nodemailer = __importStar(require("nodemailer"));
const Brevo = __importStar(require("@getbrevo/brevo"));
const crypto = __importStar(require("crypto"));
let AuthService = class AuthService {
    constructor(users, jwt, redis) {
        this.users = users;
        this.jwt = jwt;
        this.redis = redis;
        const smtpHost = process.env.SMTP_HOST;
        const smtpPort = process.env.SMTP_PORT || 587;
        const smtpUser = process.env.SMTP_USERNAME;
        const smtpPass = process.env.SMTP_PASSWORD;
        if (smtpHost && smtpUser && smtpPass) {
            this.emailTransporter = nodemailer.createTransporter({
                host: smtpHost,
                port: parseInt(smtpPort.toString()),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: smtpUser,
                    pass: smtpPass,
                },
            });
        }
        const sendinblueApiKey = process.env.SENDINBLUE_API_KEY;
        if (sendinblueApiKey) {
            this.sendinblueClient = new Brevo.ConversationsApi();
            this.sendinblueClient.apiKey = sendinblueApiKey;
        }
    }
    async checkRateLimit(key, limit, ttlSeconds) {
        const count = await this.redis.incr(key);
        if (count === 1)
            await this.redis.expire(key, ttlSeconds);
        if (count > limit) {
            throw new common_1.UnauthorizedException('Too many requests. Please try again later.');
        }
    }
    async requestOtp(phone, email) {
        const id = phone || email;
        if (!id)
            throw new common_1.UnauthorizedException('Phone or Email is required');
        const kind = phone ? 'phone' : 'email';
        await this.checkRateLimit(`rl:otp:${kind}:${id}`, 5, 300);
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const key = `otp:${kind}:${id}`;
        await this.redis.setex(key, 300, otp);
        try {
            if (phone && this.sendinblueClient) {
                await this.sendinblueClient.conversationsPost({
                    contact: { phone: phone },
                    messages: [{
                            type: 'text',
                            text: `Your AgriHub OTP is: ${otp}`,
                            from: 'AgriHub'
                        }]
                });
            }
            else if (email && this.emailTransporter) {
                await this.emailTransporter.sendMail({
                    from: 'noreply@agrihub.com',
                    to: email,
                    subject: 'AgriHub OTP Verification',
                    text: `Your AgriHub OTP is: ${otp}`,
                    html: `<strong>Your AgriHub OTP is: ${otp}</strong>`,
                });
            }
            else {
                throw new common_1.UnauthorizedException('SMS/Email provider not configured');
            }
        }
        catch (error) {
            console.error('Failed to send OTP:', error);
            throw new common_1.UnauthorizedException('Failed to send OTP. Please try again.');
        }
        return { success: true };
    }
    async resendOtp(phone, email) {
        return this.requestOtp(phone, email);
    }
    async checkUser(phone, email) {
        let user = null;
        if (phone)
            user = await this.users.findByPhone(phone);
        else if (email)
            user = await this.users.findByEmail(email);
        else
            throw new common_1.UnauthorizedException('Phone or Email is required');
        return { exists: !!user };
    }
    async verifyOtp(phone, email, otp, name, role) {
        if (!otp)
            throw new common_1.UnauthorizedException('OTP is required');
        const id = phone || email;
        if (!id)
            throw new common_1.UnauthorizedException('Phone or Email is required');
        const kind = phone ? 'phone' : 'email';
        const key = `otp:${kind}:${id}`;
        const stored = await this.redis.get(key);
        if (!stored || stored !== otp)
            throw new common_1.UnauthorizedException('Invalid OTP');
        const user = phone
            ? await this.users.upsertByPhone(phone, name || 'User', role || 'CONSUMER')
            : await this.users.upsertByEmail(email, name || 'User', role || 'CONSUMER');
        const token = await this.jwt.signAsync({ sub: user.id, role: user.role, name: user.name });
        await this.redis.del(key);
        return { token, needsPassword: !user.password };
    }
    async login(phone, password) {
        const user = await this.users.findByPhone(phone);
        if (!user || !user.password)
            throw new common_1.UnauthorizedException('User not found or OTP required');
        const hashed = crypto.createHash('sha256').update(password).digest('hex');
        if (hashed !== user.password)
            throw new common_1.UnauthorizedException('Invalid password');
        const token = await this.jwt.signAsync({ sub: user.id, role: user.role, name: user.name });
        return { token };
    }
    async setPassword(userId, newPassword) {
        if (!newPassword || newPassword.length < 8) {
            throw new common_1.UnauthorizedException('Password must be at least 8 characters');
        }
        const hashed = crypto.createHash('sha256').update(newPassword).digest('hex');
        await this.users.updatePassword(userId, hashed);
        return { success: true };
    }
    async changePassword(userId, oldPassword, newPassword) {
        const user = await this.users.findById(userId);
        if (!user || !user.password)
            throw new common_1.UnauthorizedException('User not found');
        const hashedOld = crypto.createHash('sha256').update(oldPassword).digest('hex');
        if (hashedOld !== user.password)
            throw new common_1.UnauthorizedException('Old password is incorrect');
        return this.setPassword(userId, newPassword);
    }
    async requestPasswordReset(phone) {
        return this.requestOtp(phone);
    }
    async resetPassword(phone, otp, newPassword) {
        const key = `otp:${phone}`;
        const stored = await this.redis.get(key);
        if (!stored || stored !== otp)
            throw new common_1.UnauthorizedException('Invalid OTP');
        const user = await this.users.findByPhone(phone);
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        await this.setPassword(user.id, newPassword);
        await this.redis.del(key);
        return { success: true };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)('REDIS')),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService, Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map