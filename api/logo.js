// Vercel Serverless Function: Secure HTTPS Image Proxy for VPS Collection Engine Logos
module.exports = async (req, res) => {
  // Enable CORS & Caching
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const rawPath = req.query?.path || '';
  if (!rawPath || typeof rawPath !== 'string') {
    return res.status(400).send('Parameter "path" diperlukan.');
  }

  // Prevent path traversal
  const cleanPath = rawPath.replace(/\.\./g, '').replace(/^\/+/, '');
  const VPS_BASE_URL = process.env.COLLECTION_ENGINE_BASE_URL || 'http://31.59.119.67';
  const targetUrl = `${VPS_BASE_URL}/storage/${cleanPath}`;

  try {
    const upstreamResp = await fetch(targetUrl, { signal: AbortSignal.timeout(6000) });
    if (!upstreamResp.ok) {
      return res.status(upstreamResp.status).send('Logo not found on storage.');
    }

    const contentType = upstreamResp.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable'); // Cache 7 days

    const arrayBuffer = await upstreamResp.arrayBuffer();
    return res.status(200).send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.warn('Logo proxy error:', err.message);
    return res.status(502).send('Error fetching logo from VPS.');
  }
};
