// Vercel Serverless Function: Admin Authentication (Stateless HMAC-SHA256 Token)
const crypto = require('crypto');

const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'admin brand').trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || 'bc_admin_hmac_secret_2026_v1_9f8a7b6c';
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function signToken(payloadObj) {
  const payloadB64 = Buffer.from(JSON.stringify(payloadObj)).toString('base64url');
  const sig = crypto.createHmac('sha256', TOKEN_SECRET).update(payloadB64).digest('base64url');
  return `${payloadB64}.${sig}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadB64, sig] = parts;
  const expectedSig = crypto.createHmac('sha256', TOKEN_SECRET).update(payloadB64).digest('base64url');
  if (sig.length !== expectedSig.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null;

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function extractBearerToken(req) {
  const auth = req.headers.authorization || req.headers.Authorization || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7).trim();
  return req.headers['x-admin-token'] || null;
}

const handler = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Token');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const token = extractBearerToken(req);
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, authenticated: false, message: 'Sesi admin tidak valid atau sudah berakhir.' });
    }
    return res.status(200).json({
      success: true,
      authenticated: true,
      user: { username: decoded.username, role: decoded.role }
    });
  }

  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    }
    const username = String(body?.username || '').trim().toLowerCase();
    const password = String(body?.password || '');

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: 'Username atau password admin salah.'
      });
    }

    const exp = Date.now() + TOKEN_TTL_MS;
    const token = signToken({
      username: 'admin brand',
      role: 'Super Admin',
      iat: Date.now(),
      exp
    });

    return res.status(200).json({
      success: true,
      token,
      expiresAt: new Date(exp).toISOString(),
      user: { username: 'admin brand', role: 'Super Admin' }
    });
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
};

handler.verifyToken = verifyToken;
handler.extractBearerToken = extractBearerToken;

module.exports = handler;
