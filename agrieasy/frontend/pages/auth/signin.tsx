import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function SignIn() {
  const router = useRouter();
  const { setToken } = useAuth();
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const qphone = (router.query.phone as string) || '';
    const qemail = (router.query.email as string) || '';
    setIdentifier(qphone || qemail);
  }, [router.query]);

  const login = async () => {
    setError(null);
    if (!identifier || identifier.trim().length < 4) { setError('Enter a valid phone number or email'); return; }
    if (!password) { setError('Enter password'); return; }
    if (!name.trim()) { setError('Enter your name'); return; }
    setLoading(true);
    try {
      // Determine if identifier is email or phone
      const isEmail = identifier.includes('@');
      const payload = isEmail
        ? { email: identifier, password, name }
        : { phone: identifier, password, name };

      console.log('Signin: Sending login request:', payload);
      const res = await api('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
      console.log('Signin: Login response:', res);
      setToken(res.token);
      router.push('/dashboard');
    } catch (e: any) {
      console.error('Signin: Login error:', e);
      setError(e?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-8">
      <h2 className="text-xl font-semibold mb-4">Sign In</h2>
      <input
        className="border p-2 w-full mb-3"
        placeholder="Phone or Email"
        value={identifier}
        onChange={e=>setIdentifier(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-3"
        placeholder="Full Name"
        value={name}
        onChange={e=>setName(e.target.value)}
      />
      <input
        type="password"
        className="border p-2 w-full mb-3"
        placeholder="Password"
        value={password}
        onChange={e=>setPassword(e.target.value)}
      />
      <button
        onClick={login}
        disabled={loading}
        className={`px-4 py-2 rounded w-full ${loading?'bg-gray-400':'bg-primary-green text-white'}`}
      >
        {loading?'Signing in...':'Sign In'}
      </button>
      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
      <div className="mt-4 text-sm">
        New user? <button className="underline text-primary-green" onClick={()=>router.push('/auth/signup')}>Go to Sign Up</button>
      </div>
    </div>
  );
}
