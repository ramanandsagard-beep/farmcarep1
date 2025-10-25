export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export async function api(path: string, options: RequestInit = {}, token?: string | null) {
  const headers: any = { ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // Don't set Content-Type for FormData (file uploads) - let fetch set it automatically
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    // Stringify body if it's an object
    if (options.body && typeof options.body === 'object') {
      options.body = JSON.stringify(options.body);
    }
  }

  try {
    // Primary via Next.js proxy
    const primaryUrl = `${API_BASE}${path}`;
    const res = await fetch(primaryUrl, { ...options, headers });
    const data = await res.text();

    if (!res.ok) {
      let errorMsg = `Request failed with status ${res.status}`;
      try {
        const errorData = JSON.parse(data);
        errorMsg = errorData.message || errorData.error || data;
      } catch (e) {}
      console.error('API Error:', errorMsg);
      throw new Error(errorMsg);
    }

    return data ? JSON.parse(data) : {};
  } catch (error) {
    // Fallback to direct API host if proxy fails with a network error
    const isNetworkError = typeof window !== 'undefined' && error instanceof TypeError;
    const canFallback = typeof window !== 'undefined';
    const fallbackBase = (process.env.NEXT_PUBLIC_API_BASE_URL_FALLBACK as string) || 'http://localhost:3001';
    if (isNetworkError && canFallback) {
      try {
        const fallbackUrl = `${fallbackBase}${path}`;
        const res2 = await fetch(fallbackUrl, { ...options, headers, mode: 'cors' });
        const data2 = await res2.text();
        if (!res2.ok) {
          let errorMsg = `Request failed with status ${res2.status}`;
          try {
            const errorData2 = JSON.parse(data2);
            errorMsg = errorData2.message || errorData2.error || data2;
          } catch (e) {}
          console.error('API Fallback Error:', errorMsg);
          throw new Error(errorMsg);
        }
        return data2 ? JSON.parse(data2) : {};
      } catch (e2) {
        console.error('API Fallback Error:', e2);
        throw e2;
      }
    }
    console.error('API Error:', error);
    throw error;
  }
}
