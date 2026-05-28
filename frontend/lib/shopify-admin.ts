/**
 * Shopify Admin API client — server-side ONLY.
 * Never import this from a Client Component.
 * Token is SHOPIFY_ADMIN_TOKEN (not the public Storefront token).
 */

const DOMAIN  = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN   = process.env.SHOPIFY_ADMIN_TOKEN;
const API_VER = '2025-01';

const configured = Boolean(DOMAIN && TOKEN);

async function adminGql<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  if (!configured) {
    throw new Error('Shopify Admin API not configured. Add SHOPIFY_ADMIN_TOKEN to .env.local');
  }

  const res = await fetch(
    `https://${DOMAIN}/admin/api/${API_VER}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type':             'application/json',
        'X-Shopify-Access-Token':   TOKEN!,
      },
      body:   JSON.stringify({ query, variables }),
      cache:  'no-store',
      signal: AbortSignal.timeout(10_000),
    },
  );

  if (!res.ok) {
    throw new Error(`Shopify Admin API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data as T;
}

/* ── Inventory ─────────────────────────────────────────────────────────────── */
export async function getLiveInventory(variantId: string): Promise<number | null> {
  if (!configured) return null;
  try {
    type Data = { productVariant: { inventoryQuantity: number } | null };
    const data = await adminGql<Data>(
      `query($id: ID!) { productVariant(id: $id) { inventoryQuantity } }`,
      { id: variantId },
    );
    return data.productVariant?.inventoryQuantity ?? null;
  } catch { return null; }
}

/* ── Order stats ───────────────────────────────────────────────────────────── */
export interface AdminOrderStats {
  total:      number;
  paid:       number;
  dispatched: number;
  revenue:    number;
  currency:   string;
}

export async function getAdminOrderStats(): Promise<AdminOrderStats | null> {
  if (!configured) return null;
  try {
    type Data = {
      totalOrders:      { count: number };
      paidOrders:       { count: number };
      dispatchedOrders: { count: number };
      orders: { edges: { node: { totalPriceSet: { shopMoney: { amount: string; currencyCode: string } } } }[] };
    };

    const data = await adminGql<Data>(`
      query {
        totalOrders:      ordersCount { count }
        paidOrders:       ordersCount(query: "financial_status:paid") { count }
        dispatchedOrders: ordersCount(query: "fulfillment_status:fulfilled") { count }
        orders(first: 250, query: "financial_status:paid") {
          edges { node { totalPriceSet { shopMoney { amount currencyCode } } } }
        }
      }
    `);

    const revenue  = data.orders.edges.reduce(
      (s, e) => s + parseFloat(e.node.totalPriceSet.shopMoney.amount), 0,
    );
    const currency = data.orders.edges[0]?.node.totalPriceSet.shopMoney.currencyCode ?? 'COP';

    return {
      total:      data.totalOrders.count,
      paid:       data.paidOrders.count,
      dispatched: data.dispatchedOrders.count,
      revenue,
      currency,
    };
  } catch { return null; }
}

/* ── Detalles del producto / variante ─────────────────────────────────────── */
export interface ProductDetails {
  productId:    string;
  productTitle: string;
  status:       'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  variantId:    string;
  price:        string;
  currencyCode: string;
  inventory:    number;
}

export async function getProductDetails(variantId: string): Promise<ProductDetails | null> {
  if (!configured || !variantId) return null;
  try {
    type Data = {
      productVariant: {
        id:                string;
        price:             string;
        inventoryQuantity: number;
        product: {
          id:           string;
          title:        string;
          status:       'ACTIVE' | 'DRAFT' | 'ARCHIVED';
          priceRangeV2: { minVariantPrice: { currencyCode: string } };
        };
      } | null;
    };

    const data = await adminGql<Data>(
      `query($id: ID!) {
        productVariant(id: $id) {
          id price inventoryQuantity
          product {
            id title status
            priceRangeV2 { minVariantPrice { currencyCode } }
          }
        }
      }`,
      { id: variantId },
    );

    const v = data.productVariant;
    if (!v) return null;

    return {
      productId:    v.product.id,
      productTitle: v.product.title,
      status:       v.product.status,
      variantId:    v.id,
      price:        v.price,
      currencyCode: v.product.priceRangeV2.minVariantPrice.currencyCode,
      inventory:    v.inventoryQuantity,
    };
  } catch { return null; }
}

/* ── Actualizar precio del variante ────────────────────────────────────────── */
export async function updateVariantPrice(
  variantId: string,
  price: string,
): Promise<{ ok: boolean; price?: string; error?: string }> {
  try {
    type Data = {
      productVariantUpdate: {
        productVariant: { price: string } | null;
        userErrors: { field: string[]; message: string }[];
      };
    };

    const data = await adminGql<Data>(
      `mutation($input: ProductVariantInput!) {
        productVariantUpdate(input: $input) {
          productVariant { price }
          userErrors { field message }
        }
      }`,
      { input: { id: variantId, price } },
    );

    const errs = data.productVariantUpdate.userErrors;
    if (errs.length > 0) return { ok: false, error: errs[0].message };
    return { ok: true, price: data.productVariantUpdate.productVariant?.price };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Error desconocido' };
  }
}

/* ── Activar / cerrar drop (publicar o archivar producto) ──────────────────── */
export async function updateDropStatus(
  productId: string,
  status: 'ACTIVE' | 'DRAFT',
): Promise<{ ok: boolean; status?: string; error?: string }> {
  try {
    type Data = {
      productUpdate: {
        product: { status: string } | null;
        userErrors: { field: string[]; message: string }[];
      };
    };

    const data = await adminGql<Data>(
      `mutation($input: ProductInput!) {
        productUpdate(input: $input) {
          product { status }
          userErrors { field message }
        }
      }`,
      { input: { id: productId, status } },
    );

    const errs = data.productUpdate.userErrors;
    if (errs.length > 0) return { ok: false, error: errs[0].message };
    return { ok: true, status: data.productUpdate.product?.status };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Error desconocido' };
  }
}

/* ── Checkout directo via Draft Order ─────────────────────────────────────── */
export async function createDraftOrderCheckout(variantId: string, quantity = 1): Promise<string> {
  type Data = {
    draftOrderCreate: {
      draftOrder: { id: string; invoiceUrl: string } | null;
      userErrors: { field: string[]; message: string }[];
    };
  };

  const data = await adminGql<Data>(
    `mutation($input: DraftOrderInput!) {
      draftOrderCreate(input: $input) {
        draftOrder { id invoiceUrl }
        userErrors  { field message }
      }
    }`,
    { input: { lineItems: [{ variantId, quantity }] } },
  );

  const errs = data.draftOrderCreate.userErrors;
  if (errs.length > 0) throw new Error(errs[0].message);

  const url = data.draftOrderCreate.draftOrder?.invoiceUrl;
  if (!url) throw new Error('Shopify no devolvió URL de checkout');
  return url;
}

/* ── Recent orders ─────────────────────────────────────────────────────────── */
export interface AdminOrder {
  id:               string;
  name:             string;
  email:            string;
  financialStatus:  string;
  fulfillmentStatus: string;
  totalPrice:       string;
  currencyCode:     string;
  createdAt:        string;
  customerName:     string;
  city:             string;
  country:          string;
}

export async function getRecentAdminOrders(limit = 25): Promise<AdminOrder[]> {
  if (!configured) return [];
  try {
    type Edge = {
      node: {
        id: string; name: string; email: string;
        financialStatus: string; displayFulfillmentStatus: string;
        totalPriceSet: { shopMoney: { amount: string; currencyCode: string } };
        createdAt: string;
        customer: { firstName: string; lastName: string } | null;
        shippingAddress: { city: string; country: string } | null;
      };
    };
    type Data = { orders: { edges: Edge[] } };

    const data = await adminGql<Data>(
      `query($n: Int!) {
        orders(first: $n, sortKey: CREATED_AT, reverse: true) {
          edges { node {
            id name email financialStatus displayFulfillmentStatus
            totalPriceSet { shopMoney { amount currencyCode } }
            createdAt
            customer { firstName lastName }
            shippingAddress { city country }
          }}
        }
      }`,
      { n: limit },
    );

    return data.orders.edges.map(({ node: o }) => ({
      id:               o.id,
      name:             o.name,
      email:            o.email,
      financialStatus:  o.financialStatus,
      fulfillmentStatus: o.displayFulfillmentStatus,
      totalPrice:       o.totalPriceSet.shopMoney.amount,
      currencyCode:     o.totalPriceSet.shopMoney.currencyCode,
      createdAt:        o.createdAt,
      customerName:     o.customer ? `${o.customer.firstName} ${o.customer.lastName}`.trim() : o.email,
      city:             o.shippingAddress?.city    ?? '—',
      country:          o.shippingAddress?.country ?? '—',
    }));
  } catch { return []; }
}
