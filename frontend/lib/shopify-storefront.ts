/**
 * Shopify Storefront Cart API (2025-01)
 * Crea un carrito headless → checkoutUrl va directo al pago de Shopify.
 * Token público — no contiene credenciales sensibles.
 */

const DOMAIN           = process.env.SHOPIFY_STORE_DOMAIN!;
const CHECKOUT_DOMAIN  = process.env.SHOPIFY_CHECKOUT_DOMAIN || DOMAIN;
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;
const API_VER          = '2025-01';

async function storefrontGql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!STOREFRONT_TOKEN) throw new Error('SHOPIFY_STOREFRONT_TOKEN no configurado');

  const res = await fetch(`https://${DOMAIN}/api/${API_VER}/graphql.json`, {
    method:  'POST',
    headers: {
      'Content-Type':                       'application/json',
      'X-Shopify-Storefront-Access-Token':  STOREFRONT_TOKEN,
    },
    body:   JSON.stringify({ query, variables }),
    cache:  'no-store',
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) throw new Error(`Storefront API error: ${res.status}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data as T;
}

export interface StorefrontCart {
  id:          string;
  checkoutUrl: string;
  total:       { amount: string; currencyCode: string };
}

/**
 * Crea un carrito via Storefront Cart API y devuelve el checkoutUrl.
 * El checkoutUrl va directo al checkout oficial de Shopify (sin storefront/tema).
 */
export async function createCart(variantId: string, quantity = 1): Promise<StorefrontCart> {
  type Data = {
    cartCreate: {
      cart: {
        id:          string;
        checkoutUrl: string;
        cost: { totalAmount: { amount: string; currencyCode: string } };
      } | null;
      userErrors: { field: string[]; message: string }[];
    };
  };

  const data = await storefrontGql<Data>(
    `mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          cost { totalAmount { amount currencyCode } }
        }
        userErrors { field message }
      }
    }`,
    {
      input: {
        lines: [{ quantity, merchandiseId: variantId }],
      },
    },
  );

  const errs = data.cartCreate.userErrors;
  if (errs.length > 0) throw new Error(errs[0].message);

  const cart = data.cartCreate.cart;
  if (!cart) throw new Error('No se pudo crear el carrito');

  // En producción reemplaza el dominio por cuscus.co
  const checkoutUrl = cart.checkoutUrl.replace(DOMAIN, CHECKOUT_DOMAIN);

  return {
    id:          cart.id,
    checkoutUrl,
    total:       cart.cost.totalAmount,
  };
}

export const storefrontConfigured = (): boolean => Boolean(STOREFRONT_TOKEN);
