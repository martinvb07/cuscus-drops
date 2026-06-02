import { NextResponse }                       from 'next/server';
import { getStock }                           from '@/lib/shopify';
import { createCart, storefrontConfigured }   from '@/lib/shopify-storefront';
import { createCheckout }                     from '@/lib/shopify';

const API = process.env.BACKEND_URL || 'http://localhost:4001';

// Rate limit: max 3 intentos por IP cada 60 segundos
const RL_MAP = new Map<string, { count: number; reset: number }>();
const RL_MAX = 3;
const RL_WINDOW = 60_000;

function rateLimitCheck(ip: string): boolean {
  const now  = Date.now();
  const entry = RL_MAP.get(ip);
  if (!entry || now > entry.reset) {
    RL_MAP.set(ip, { count: 1, reset: now + RL_WINDOW });
    return true;
  }
  if (entry.count >= RL_MAX) return false;
  entry.count++;
  return true;
}

// Limpiar entradas expiradas cada 5 min para no acumular memoria
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of RL_MAP) if (now > v.reset) RL_MAP.delete(k);
}, 300_000);

async function trackEvent(event: string, data?: Record<string, unknown>) {
  try {
    await fetch(`${API}/api/analytics/event`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ event, data }),
    });
  } catch { /* non-fatal */ }
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!rateLimitCheck(ip)) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Espera un momento e inténtalo de nuevo.' },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => ({})) as { quantity?: number };
  const quantity = Math.max(1, Math.min(10, Number(body.quantity) || 1));

  await trackEvent('checkout_click');
  try {
    const variantId = process.env.SHOPIFY_VARIANT_ID;
    if (!variantId) {
      return NextResponse.json(
        { error: 'Shopify no configurado. Agrega las credenciales en .env.local' },
        { status: 503 },
      );
    }

    const stock = await getStock(variantId);
    if (stock !== null && stock <= 0) {
      return NextResponse.json({ error: 'Sin stock disponible' }, { status: 409 });
    }
    if (stock !== null && quantity > stock) {
      return NextResponse.json(
        { error: `Solo quedan ${stock} unidades disponibles` },
        { status: 409 },
      );
    }

    let checkoutUrl: string;

    if (storefrontConfigured()) {
      const cart  = await createCart(variantId, quantity);
      checkoutUrl = cart.checkoutUrl;
    } else {
      checkoutUrl = await createCheckout(variantId, quantity);
    }

    await trackEvent('checkout_started', { variantId, quantity });
    return NextResponse.json({ url: checkoutUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error al crear el checkout. Inténtalo de nuevo.' }, { status: 500 });
  }
}
