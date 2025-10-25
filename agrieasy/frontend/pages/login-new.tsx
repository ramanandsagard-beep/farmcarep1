import { useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function Login() {
  const [mode, setMode] = useState<'phone'|'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState<'phone'|'otp'>('phone');
  const [name, setName] = useState('');
  const [role, setRole] = useState('CONSUMER');
  const [serverOtp, setServerOtp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setToken } = useAuth();
  const router = useRouter();

  const requestOtp = async () => {
    console.log('Requesting OTP...');
    setError(null);
    setIsLoading(true);
    
    try {
      const identifier = mode === 'email' ? email : phone;
      console.log('Sending OTP request for:', { [mode]: identifier });
      
      // For testing - use mock response
      console.log('Using mock OTP response');
      const mockOtp = '123456';
      setServerOtp(mockOtp);
      setStage('otp');
      console.log('Mock OTP set, moving to OTP stage');
      
      // Uncomment this for real API call
      /*
      const res = await api('/auth/request-otp', { 
        method: 'POST', 
        body: JSON.stringify({ [mode]: identifier }) 
      });
      console.log('OTP response:', res);
      setServerOtp(res.otp || null);
      setStage('otp');
      */
    } catch (error) {
      console.error('OTP Request Error:', error);
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    console.log('Verifying OTP...');
    setError(null);
    setIsLoading(true);
    
    try {
      const identifier = mode === 'email' ? email : phone;
      console.log('Verifying OTP:', { [mode]: identifier, otp, name, role });
      
      // For testing - use mock response
      console.log('Using mock verification');
      const mockToken = 'mock-jwt-token';
      setToken(mockToken);
      console.log('Mock token set, redirecting to dashboard');
      router.push('/dashboard');
      
      // Uncomment this for real API call
      /*
      const res = await api('/auth/verify-otp', { 
        method: 'POST', 
        body: JSON.stringify({ 
          [mode]: identifier,
          otp,
          name,
          role 
        }) 
      });
      console.log('Verify OTP response:', res);
      setToken(res.token);
      router.push('/dashboard');
      */
    } catch (error) {
      console.error('OTP Verification Error:', error);
      setError('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {stage === 'phone' ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Login with OTP</h2>
          <div className="flex gap-2 mb-3">
            <button 
              onClick={() => setMode('phone')} 
              className={`${mode==='phone'?'bg-agrigreen text-white':'bg-gray-200'} px-3 py-2 rounded`}
              disabled={isLoading}
            >
              Phone
            </button>
            <button 
              onClick={() => setMode('email')} 
              className={`${mode==='email'?'bg-agrigreen text-white':'bg-gray-200'} px-3 py-2 rounded`}
              disabled={isLoading}
            >
              Email
            </button>
          </div>
          
          {mode==='phone' ? (
            <input 
              className="border p-2 w-full mb-3" 
              placeholder="Enter phone number" 
              value={phone} 
              onChange={e => setPhone(e.target.value)}
              disabled={isLoading}
            />
          ) : (
            <input 
              className="border p-2 w-full mb-3" 
              placeholder="Enter email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              disabled={isLoading}
            />
          )}
          
          <button 
            onClick={requestOtp} 
            className={`bg-agrigreen text-white px-4 py-2 rounded w-full ${isLoading ? 'opacity-50' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Request OTP'}
          </button>
          
          {/* Debug info */}
          <div className="mt-4 p-3 bg-gray-100 text-xs text-gray-600 rounded">
            <p>Debug Info:</p>
            <p>Mode: {mode}</p>
            <p>Stage: {stage}</p>
            <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
            {serverOtp && <p>Server OTP: {serverOtp}</p>}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">Enter OTP</h2>
          {serverOtp && (
            <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 text-sm rounded">
              <p>For testing, use this OTP: <span className="font-mono font-bold">{serverOtp}</span></p>
            </div>
          )}
          
          <input 
            className="border p-2 w-full mb-3" 
            placeholder="Enter OTP" 
            value={otp} 
            onChange={e => setOtp(e.target.value)}
            disabled={isLoading}
          />
          
          <input 
            className="border p-2 w-full mb-3" 
            placeholder="Your name" 
            value={name} 
            onChange={e => setName(e.target.value)}
            disabled={isLoading}
          />
          
          <select 
            className="border p-2 w-full mb-3" 
            value={role} 
            onChange={e => setRole(e.target.value)}
            disabled={isLoading}
          >
            <option value="FARMER">Farmer</option>
            <option value="EQUIPMENT_VENDOR">Equipment Vendor</option>
            <option value="INPUT_SUPPLIER">Input Supplier</option>
            <option value="TRANSPORTER">Transporter</option>
            <option value="CONSUMER">Consumer</option>
            <option value="ADMIN">Admin</option>
          </select>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setStage('phone')} 
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded"
              disabled={isLoading}
            >
              Back
            </button>
            <button 
              onClick={verifyOtp} 
              className={`flex-1 bg-agrigreen text-white px-4 py-2 rounded ${isLoading ? 'opacity-50' : ''}`}
              disabled={isLoading || !otp || !name}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
