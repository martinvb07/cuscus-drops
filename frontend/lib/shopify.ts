const DOMAIN      = process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const API_VER     = '2025-01';

function numericId(gid: string): string {
  return gid.split('/').pop() ?? gid;
}

async function adminRest(path: string) {
  if (!DOMAIN || !ADMIN_TOKEN) return null;
  try {
    const res = await fetch(
      `https://${DOMAIN}/admin/api/${API_VER}${path}`,
      { headers: { 'X-Shopify-Access-Token': ADMIN_TOKEN }, cache: 'no-store', signal: AbortSignal.timeout(10_000) },
    );
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

/* ── Crear URL de checkout directa ─────────────────────────────────────────── */
export async function createCheckout(variantId: string, quantity = 1): Promise<string> {
  if (!DOMAIN) throw new Error('SHOPIFY_STORE_DOMAIN no configurado');
  return `https://${DOMAIN}/cart/${numericId(variantId)}:${quantity}`;
}

/* ── Stock disponible ─────────────────────────────────────────────────────── */
export async function getStock(variantId: string): Promise<number | null> {
  if (!variantId) return null;
  const data = await adminRest(`/variants/${numericId(variantId)}.json`);
  return data?.variant?.inventory_quantity ?? null;
}

/* ── Precio y moneda del variante ─────────────────────────────────────────── */
export interface VariantPrice {
  amount:       string;
  currencyCode: string;
}

export async function getVariantPrice(variantId: string): Promise<VariantPrice | null> {
  if (!variantId) return null;
  const data = await adminRest(`/variants/${numericId(variantId)}.json`);
  if (!data?.variant) return null;
  return {
    amount:       data.variant.price,
    currencyCode: process.env.PRODUCT_CURRENCY ?? 'COP',
  };
}
