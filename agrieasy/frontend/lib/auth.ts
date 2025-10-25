import { api } from './api';

export interface AuthResponse {
  success: boolean;
  otp?: string;
  token?: string;
  error?: string;
}

export const authService = {
  async requestOtp(identifier: string, isEmail: boolean = false): Promise<AuthResponse> {
    try {
      const payload = { 
        phone: isEmail ? undefined : identifier,
        email: isEmail ? identifier : undefined
      };
      
      const response = await api('/auth/request-otp', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      return { 
        success: true, 
        otp: response.otp 
      };
    } catch (error) {
      console.error('OTP Request Error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send OTP' 
      };
    }
  },

  async verifyOtp(
    identifier: string, 
    otp: string, 
    name: string, 
    role: string,
    isEmail: boolean = false
  ): Promise<AuthResponse> {
    try {
      const payload = {
        phone: isEmail ? undefined : identifier,
        email: isEmail ? identifier : undefined,
        otp,
        name,
        role
      };
      
      const response = await api('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      return { 
        success: true, 
        token: response.token 
      };
    } catch (error) {
      console.error('OTP Verification Error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to verify OTP' 
      };
    }
  }
};
