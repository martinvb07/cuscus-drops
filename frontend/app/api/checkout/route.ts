import { NextResponse }                                    from 'next/server';
import { getStock }                                         from '@/lib/shopify';
import { createCart, storefrontConfigured }  from '@/lib/shopify-storefront';
import { createCheckout }                                   from '@/lib/shopify';

const API = process.env.BACKEND_URL || 'http://localhost:4001';

async function trackEvent(event: string, data?: Record<string, unknown>) {
  try {
    await fetch(`${API}/api/analytics/event`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ event, data }),
    });
  } catch { /* non-fatal */ }
}

export async function POST() {
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

    let checkoutUrl: string;

    if (storefrontConfigured()) {
      // Storefront API → checkout directo sin pasar por el storefront de Shopify
      const cart  = await createCart(variantId, 1);
      checkoutUrl = cart.checkoutUrl;
    } else {
      // Fallback: URL de carrito (muestra el storefront de Shopify)
      checkoutUrl = await createCheckout(variantId, 1);
    }

    await trackEvent('checkout_started', { variantId });
    return NextResponse.json({ url: checkoutUrl });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error al crear checkout';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
