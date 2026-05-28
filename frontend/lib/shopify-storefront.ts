/**
 * Shopify Storefront API — checkout headless.
 * Requiere SHOPIFY_STOREFRONT_TOKEN (token público, no el Admin).
 * Crea un checkout que va directo al pago de Shopify, sin pasar por el storefront.
 */

const DOMAIN           = process.env.SHOPIFY_STORE_DOMAIN!;
const CHECKOUT_DOMAIN  = process.env.SHOPIFY_CHECKOUT_DOMAIN || DOMAIN;
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;
const API_VER          = '2025-01';

async function storefrontGql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!STOREFRONT_TOKEN) throw new Error('SHOPIFY_STOREFRONT_TOKEN no configurado');

  const res = await fetch(
    `https://${DOMAIN}/api/${API_VER}/graphql.json`,
    {
      method:  'POST',
      headers: {
        'Content-Type':                       'application/json',
        'X-Shopify-Storefront-Access-Token':  STOREFRONT_TOKEN,
      },
      body:    JSON.stringify({ query, variables }),
      cache:   'no-store',
      signal:  AbortSignal.timeout(10_000),
    },
  );

  if (!res.ok) throw new Error(`Storefront API error: ${res.status}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data as T;
}

export interface StorefrontCheckout {
  id:      string;
  webUrl:  string;    // URL directa al checkout de Shopify (sin storefront)
  totalPrice: { amount: string; currencyCode: string };
}

/**
 * Crea un checkout de Shopify que:
 * 1. Va directo al pago (webUrl) — sin pasar por el storefront/carrito
 * 2. Después del pago redirige a returnUrl con el estado de la orden
 */
export async function createStorefrontCheckout(
  variantId: string,
  quantity   = 1,
  returnUrl  = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/success`,
): Promise<StorefrontCheckout> {
  type Data = {
    checkoutCreate: {
      checkout: {
        id: string;
        webUrl: string;
        totalPriceV2: { amount: string; currencyCode: string };
      } | null;
      checkoutUserErrors: { code: string; field: string[]; message: string }[];
    };
  };

  const data = await storefrontGql<Data>(
    `mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
          totalPriceV2 { amount currencyCode }
        }
        checkoutUserErrors { code field message }
      }
    }`,
    {
      input: {
        lineItems: [{ variantId, quantity }],
        allowPartialAddresses: true,
        presentmentCurrencyCode: 'COP',
      },
    },
  );

  const errs = data.checkoutCreate.checkoutUserErrors;
  if (errs.length > 0) throw new Error(errs[0].message);

  const checkout = data.checkoutCreate.checkout;
  if (!checkout) throw new Error('No se pudo crear el checkout');

  // Reemplaza dominio por el de checkout configurado (cuscushats.com en prod)
  let webUrl = checkout.webUrl.replace(DOMAIN, CHECKOUT_DOMAIN);

  // Agrega return_to para que Shopify muestre "Volver a la tienda" apuntando a nuestro /success
  const sep = webUrl.includes('?') ? '&' : '?';
  webUrl += `${sep}return_to=${encodeURIComponent(returnUrl)}`;

  return {
    id:         checkout.id,
    webUrl,
    totalPrice: checkout.totalPriceV2,
  };
}

export function storefrontConfigured(): boolean {
  return Boolean(STOREFRONT_TOKEN);
}
