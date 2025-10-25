import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, email, ...rest } = req.body;
  console.log('OTP Request:', { phone, email, ...rest });
  
  // Always return success for testing
  return res.status(200).json({ 
    success: true, 
    otp: '1234', // Mock OTP for testing
    debug: { phone, email, ...rest }
  });
}
