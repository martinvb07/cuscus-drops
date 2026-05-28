import { NextResponse } from 'next/server';
import { createCheckout } from '@/lib/shopify';

const API = process.env.BACKEND_URL || 'http://localhost:4001';

async function trackEvent(event: string, data?: Record<string, unknown>) {
  try {
    await fetch(`${API}/api/analytics/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, data }),
    });
  } catch { /* non-fatal */ }
}

export async function POST() {
  await trackEvent('checkout_click');
  try {
    const variantId = process.env.SHOPIFY_VARIANT_ID;
    if (!variantId) {
      return NextResponse.json({ error: 'Shopify no configurado. Agrega las credenciales en .env.local' }, { status: 503 });
    }
    const checkoutUrl = await createCheckout(variantId, 1);
    await trackEvent('checkout_started', { variantId });
    return NextResponse.json({ url: checkoutUrl });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error al crear checkout';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
