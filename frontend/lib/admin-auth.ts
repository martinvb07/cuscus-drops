import { createHmac, timingSafeEqual, scryptSync } from 'node:crypto';

const TOKEN_TTL = 8 * 60 * 60 * 1000; // 8 horas

function jwtSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('JWT_SECRET no configurado');
  return s;
}

/** Emite un token HMAC-SHA256 con payload {sub, exp} */
export function signAdminToken(): string {
  const payload = JSON.stringify({ sub: 'admin', exp: Date.now() + TOKEN_TTL });
  const data    = Buffer.from(payload).toString('base64url');
  const sig     = createHmac('sha256', jwtSecret()).update(data).digest('base64url');
  return `${data}.${sig}`;
}

/** Verifica firma y expiración. Devuelve true si el token es válido. */
export function verifyAdminToken(token: string | null | undefined): boolean {
  if (!token) return false;
  try {
    const dot = token.lastIndexOf('.');
    if (dot === -1) return false;
    const data = token.slice(0, dot);
    const sig  = token.slice(dot + 1);

    const expected = createHmac('sha256', jwtSecret()).update(data).digest('base64url');
    const sigBuf   = Buffer.from(sig,      'base64url');
    const expBuf   = Buffer.from(expected, 'base64url');
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return false;

    const { sub, exp } = JSON.parse(Buffer.from(data, 'base64url').toString());
    return sub === 'admin' && typeof exp === 'number' && exp > Date.now();
  } catch {
    return false;
  }
}

/**
 * Verifica la contraseña contra ADMIN_PASSWORD_HASH (formato "salt:hash" generado
 * por scripts/generate-admin-hash.js usando scryptSync).
 */
export function verifyPasswordHash(input: string, stored: string): boolean {
  try {
    const colonIdx = stored.indexOf(':');
    if (colonIdx === -1) return false;
    const salt    = stored.slice(0, colonIdx);
    const hashHex = stored.slice(colonIdx + 1);
    const inputHash    = scryptSync(input, salt, 64);
    const storedBuffer = Buffer.from(hashHex, 'hex');
    if (inputHash.length !== storedBuffer.length) return false;
    return timingSafeEqual(inputHash, storedBuffer);
  } catch {
    return false;
  }
}

/** Extrae y verifica el token del header x-admin-token o Authorization: Bearer */
export function verifyAdminRequest(req: Request): boolean {
  const h = req.headers.get('x-admin-token')
    ?? req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  return verifyAdminToken(h);
}
