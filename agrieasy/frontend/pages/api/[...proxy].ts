import { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL_FALLBACK || 'http://localhost:3001';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pathParts = req.url?.split('?') || [];
  const backendPath = pathParts[0].replace('/api', '');

  try {
    const backendUrl = `${BACKEND_URL}${backendPath}${pathParts[1] ? `?${pathParts[1]}` : ''}`;

    // Prepare headers - don't set content-type for FormData (file uploads)
    const headers: any = {};
    if (req.headers.authorization) {
      headers.authorization = req.headers.authorization;
    }

    // Forward the request to backend
    const response = await fetch(backendUrl, {
      method: req.method,
      headers,
      body: req.body,
    });

    const data = await response.text();

    res.status(response.status);
    res.setHeader('content-type', response.headers.get('content-type') || 'application/json');

    if (response.status >= 200 && response.status < 300) {
      try {
        res.json(JSON.parse(data));
      } catch {
        res.send(data);
      }
    } else {
      res.send(data);
    }
  } catch (error) {
    console.error('API Proxy Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
