import { NextResponse } from 'next/server';
import { createCheckout } from '@/lib/shopify';

export async function POST() {
  try {
    const variantId = process.env.SHOPIFY_VARIANT_ID;
    if (!variantId) {
      return NextResponse.json({ error: 'Shopify no configurado. Agrega las credenciales en .env.local' }, { status: 503 });
    }
    const checkoutUrl = await createCheckout(variantId, 1);
    return NextResponse.json({ url: checkoutUrl });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error al crear checkout';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
