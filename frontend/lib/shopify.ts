const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN  = process.env.SHOPIFY_STOREFRONT_TOKEN;

const configured = Boolean(DOMAIN && TOKEN);

async function storefrontFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!configured) throw new Error('Shopify no configurado');

  const res = await fetch(`https://${DOMAIN}/api/2024-10/graphql.json`, {
    method:  'POST',
    headers: {
      'Content-Type':                      'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN!,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data as T;
}

export async function createCheckout(variantId: string, quantity = 1): Promise<string> {
  if (!configured) throw new Error('Shopify no configurado. Agrega las credenciales en .env.local');

  const data = await storefrontFetch<{
    cartCreate: { cart: { checkoutUrl: string }; userErrors: { message: string }[] };
  }>(`
    mutation cartCreate($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart { checkoutUrl }
        userErrors { field message }
      }
    }
  `, { lines: [{ quantity, merchandiseId: variantId }] });

  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }
  return data.cartCreate.cart.checkoutUrl;
}

export async function getStock(variantId: string): Promise<number | null> {
  if (!configured || !variantId) return null;

  try {
    const data = await storefrontFetch<{ node: { quantityAvailable: number } }>(`
      query getStock($id: ID!) {
        node(id: $id) {
          ... on ProductVariant { quantityAvailable }
        }
      }
    `, { id: variantId });

    return data.node?.quantityAvailable ?? null;
  } catch {
    return null;
  }
}
