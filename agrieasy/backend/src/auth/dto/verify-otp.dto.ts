export class VerifyOtpDto {
  phone?: string;
  email?: string;
  otp!: string;
  name?: string;
  role?: 'FARMER' | 'EQUIPMENT_VENDOR' | 'INPUT_SUPPLIER' | 'TRANSPORTER' | 'CONSUMER' | 'ADMIN';
}
