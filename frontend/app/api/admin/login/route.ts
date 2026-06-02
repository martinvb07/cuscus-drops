import { NextResponse } from 'next/server';
import { signAdminToken, verifyPasswordHash } from '@/lib/admin-auth';

// Rate limit: máx 5 intentos por IP cada 15 minutos
const RL_MAP    = new Map<string, { count: number; reset: number }>();
const RL_MAX    = 5;
const RL_WINDOW = 15 * 60_000;

function rateLimitCheck(ip: string): boolean {
  const now   = Date.now();
  const entry = RL_MAP.get(ip);
  if (!entry || now > entry.reset) {
    RL_MAP.set(ip, { count: 1, reset: now + RL_WINDOW });
    return true;
  }
  if (entry.count >= RL_MAX) return false;
  entry.count++;
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [k, v] of RL_MAP) if (now > v.reset) RL_MAP.delete(k);
}, 5 * 60_000);

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!rateLimitCheck(ip)) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Espera 15 minutos e inténtalo de nuevo.' },
      { status: 429 },
    );
  }

  const { password } = await req.json().catch(() => ({})) as { password?: string };
  if (!password) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const hash  = process.env.ADMIN_PASSWORD_HASH ?? '';
  const valid = hash ? verifyPasswordHash(password, hash) : false;

  if (!valid) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const token = signAdminToken();
  return NextResponse.json({ ok: true, token });
}
