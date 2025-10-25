import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function SignUp() {
  const router = useRouter();
  const { setToken, token } = useAuth();

  const phone = (router.query.phone as string) || '';
  const email = (router.query.email as string) || '';
  const isEmail = useMemo(() => !!email, [email]);

  const [otp, setOtp] = useState('');
  const [serverOtp, setServerOtp] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('CONSUMER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'otp' | 'setpw'>('otp');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Check if user exists first, then request OTP only if new user
  useEffect(() => {
    (async () => {
      if (!phone && !email) return;

      // First check if user exists
      try {
        const res = await api('/auth/check-user', { method: 'POST', body: JSON.stringify(isEmail ? { email } : { phone }) });
        if (res.exists) {
          // User exists - redirect to signin immediately
          const qp = isEmail ? `email=${encodeURIComponent(email)}` : `phone=${encodeURIComponent(phone)}`;
          router.replace(`/auth/signin?${qp}`);
          return;
        }
      } catch (error) {
        console.error('Error checking user:', error);
        // If check fails, still allow signup but don't auto-request OTP
        return;
      }

      // Only request OTP if user doesn't exist
      if (!loading) {
        requestOtp();
      }
    })();
  }, [phone, email, isEmail, router]);

  const requestOtp = async () => {
    setError(null);
    setLoading(true);
    try {
      const payload = isEmail ? { email } : { phone };
      const res = await api('/auth/request-otp', { method: 'POST', body: JSON.stringify(payload) });
      setServerOtp(res.otp || null);
      setStep('otp');
    } catch (e: any) {
      setError(e?.message || 'Could not request OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError(null);
    setLoading(true);
    try {
      const payload: any = isEmail ? { email, otp, name, role } : { phone, otp, name, role };
      const res = await api('/auth/verify-otp', { method: 'POST', body: JSON.stringify(payload) });
      setToken(res.token);
      if (res.needsPassword) {
        setStep('setpw');
      } else {
        router.push('/dashboard');
      }
    } catch (e: any) {
      setError(e?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const savePassword = async () => {
    setError(null);
    if (newPassword.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      await api('/auth/set-password', { method: 'POST', body: JSON.stringify({ newPassword }) }, token || undefined);
      router.push('/dashboard');
    } catch (e: any) {
      setError(e?.message || 'Could not set password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-8">
      {step === 'otp' ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Sign Up</h2>
          <div className="text-sm text-gray-600 mb-2">{isEmail ? `Email: ${email}` : `Phone: ${phone}`}</div>
          <div className="mb-2 text-sm text-gray-600">OTP sent to your {isEmail ? 'email' : 'phone'}</div>
          <input className="border p-2 w-full mb-3" placeholder="Enter OTP" value={otp} onChange={e=>setOtp(e.target.value)} />
          <input className="border p-2 w-full mb-3" placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} />
          <select className="border p-2 w-full mb-3" value={role} onChange={e=>setRole(e.target.value)}>
            <option value="FARMER">Farmer</option>
            <option value="EQUIPMENT_VENDOR">Equipment Vendor</option>
            <option value="INPUT_SUPPLIER">Input Supplier</option>
            <option value="TRANSPORTER">Transporter</option>
            <option value="CONSUMER">Consumer</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button onClick={verifyOtp} disabled={loading} className={`px-4 py-2 rounded w-full ${loading?'bg-gray-400':'bg-primary-green text-white'}`}>{loading ? 'Verifying...' : 'Verify OTP'}</button>
          <button onClick={requestOtp} disabled={loading} className="mt-2 w-full px-4 py-2 rounded bg-gray-200 text-gray-800">Resend OTP</button>
          {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">Create Password</h2>
          <input
            type="password"
            className="border p-2 w-full mb-3"
            placeholder="Password (min 8 chars)"
            value={newPassword}
            onChange={e=>setNewPassword(e.target.value)}
          />
          <input
            type="password"
            className="border p-2 w-full mb-3"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e=>setConfirmPassword(e.target.value)}
          />
          <button onClick={savePassword} disabled={loading} className={`px-4 py-2 rounded w-full ${loading?'bg-gray-400':'bg-primary-green text-white'}`}>{loading ? 'Saving...' : 'Save & Continue'}</button>
          {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
        </div>
      )}
      <div className="mt-4 text-sm">
        <button className="underline text-primary-green" onClick={()=>{
          const qp = isEmail ? `email=${encodeURIComponent(email)}` : `phone=${encodeURIComponent(phone)}`;
          router.push(`/login?${qp}`);
        }}>← Back to Login</button>
        {' | '}
        Already have an account? <button className="underline text-primary-green" onClick={()=>{
          const qp = isEmail ? `email=${encodeURIComponent(email)}` : `phone=${encodeURIComponent(phone)}`;
          router.push(`/auth/signin?${qp}`);
        }}>Sign In Instead</button>
      </div>
    </div>
  );
}
