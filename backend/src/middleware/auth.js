import { createHmac, timingSafeEqual } from 'node:crypto';

function verifyAdminToken(token) {
  if (!token) return false;
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return false;

    const dot = token.lastIndexOf('.');
    if (dot === -1) return false;
    const data = token.slice(0, dot);
    const sig  = token.slice(dot + 1);

    const expected = createHmac('sha256', secret).update(data).digest('base64url');
    const sigBuf   = Buffer.from(sig,      'base64url');
    const expBuf   = Buffer.from(expected, 'base64url');
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return false;

    const { sub, exp } = JSON.parse(Buffer.from(data, 'base64url').toString());
    return sub === 'admin' && typeof exp === 'number' && exp > Date.now();
  } catch {
    return false;
  }
}

export function requireAdmin(req, res, next) {
  const token = req.headers['x-admin-token']
    ?? req.headers['authorization']?.replace(/^Bearer\s+/i, '');
  if (!verifyAdminToken(token)) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  next();
}
