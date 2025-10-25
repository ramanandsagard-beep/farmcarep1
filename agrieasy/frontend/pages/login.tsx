import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

export default function Login() {
  const [mode, setMode] = useState<'phone'|'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useTranslation('common');

  // Handle query parameters
  useEffect(() => {
    const qphone = (router.query.phone as string) || '';
    const qemail = (router.query.email as string) || '';

    if (qphone) {
      setPhone(qphone);
      setMode('phone');
    } else if (qemail) {
      setEmail(qemail);
      setMode('email');
    }
  }, [router.query]);

  // Auto-check if user exists when parameters are provided via URL
  useEffect(() => {
    const qphone = (router.query.phone as string) || '';
    const qemail = (router.query.email as string) || '';

    if ((qphone || qemail) && (phone || email) && !loading) {
      checkIfRegistered();
    }
  }, [router.query, phone, email, loading]);

  const checkIfRegistered = async () => {
    setError(null);
    if (mode === 'phone') {
      if (!phone || phone.trim().length < 4) { setError('Enter a valid phone number'); return; }
    } else {
      if (!email || !email.includes('@')) { setError('Enter a valid email'); return; }
    }
    setLoading(true);
    try {
      const payload = mode === 'email' ? { email } : { phone };
      const res = await api('/auth/check-user', { method: 'POST', body: JSON.stringify(payload) });

      if (res.exists) {
        // User exists - route to signin (password login)
        const qp = mode === 'email' ? `email=${encodeURIComponent(email)}` : `phone=${encodeURIComponent(phone)}`;
        router.push(`/auth/signin?${qp}`);
      } else {
        // New user - route to signup (OTP verification)
        const qp = mode === 'email' ? `email=${encodeURIComponent(email)}` : `phone=${encodeURIComponent(phone)}`;
        router.push(`/auth/signup?${qp}`);
      }
    } catch (e: any) {
      setError(e?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <div>
          <h2 className="text-xl font-semibold mb-4">{t('login')}</h2>
          <div className="flex gap-2 mb-3">
            <button onClick={()=>setMode('phone')} className={`${mode==='phone'?'bg-primary-green text-white':'bg-gray-200'} px-3 py-2 rounded`}>{t('phone')}</button>
            <button onClick={()=>setMode('email')} className={`${mode==='email'?'bg-primary-green text-white':'bg-gray-200'} px-3 py-2 rounded`}>{t('email')}</button>
          </div>
          {mode==='phone' ? (
            <input className="border p-2 w-full mb-3" placeholder={t('phone')} value={phone} onChange={e=>setPhone(e.target.value)} />
          ) : (
            <input className="border p-2 w-full mb-3" placeholder={t('email')} value={email} onChange={e=>setEmail(e.target.value)} />
          )}
          <button onClick={checkIfRegistered} disabled={loading} className={`px-4 py-2 rounded w-full ${loading?'bg-gray-400':'bg-primary-green text-white'}`}>{loading ? 'Please wait...' : t('continue')}</button>
          {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
        </div>
    </div>
  );
}
