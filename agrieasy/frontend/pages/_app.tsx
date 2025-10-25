import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { appWithTranslation } from 'next-i18next';
import '../i18n';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister())).catch(() => {});
      }
      if ('caches' in window) {
        caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))).catch(() => {});
      }
    }
  }, []);
  return (
    <AuthProvider>
      <Navbar />
      <main className="max-w-6xl mx-auto p-4">
        <Component {...pageProps} />
      </main>
    </AuthProvider>
  );
}

export default appWithTranslation(MyApp);
