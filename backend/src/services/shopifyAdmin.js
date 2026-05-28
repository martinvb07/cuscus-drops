/**
 * Shopify Admin API client — backend.
 * Usado para escribir de vuelta a Shopify (crear fulfillments, etc.)
 */

const DOMAIN  = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN   = process.env.SHOPIFY_ADMIN_TOKEN;
const API_VER = '2025-01';

async function adminGql(query, variables = {}) {
  if (!DOMAIN || !TOKEN) return null;

  try {
    const res = await fetch(`https://${DOMAIN}/admin/api/${API_VER}/graphql.json`, {
      method:  'POST',
      headers: {
        'Content-Type':           'application/json',
        'X-Shopify-Access-Token': TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) {
      console.error(`❌ Shopify Admin API ${res.status}: ${res.statusText}`);
      return null;
    }

    const json = await res.json();
    if (json.errors?.length) {
      console.error('❌ Shopify GQL error:', json.errors[0].message);
      return null;
    }
    return json.data;
  } catch (err) {
    console.error('❌ Shopify Admin fetch error:', err.message);
    return null;
  }
}

/* ── Crear fulfillment en Shopify ─────────────────────────────────────────── */
export async function createShopifyFulfillment({
  shopifyOrderId,
  trackingNumber,
  trackingCompany,
  trackingUrl,
}) {
  if (!DOMAIN || !TOKEN) return null;

  // Construir GID si viene como número plano
  const orderGid = shopifyOrderId.startsWith('gid://')
    ? shopifyOrderId
    : `gid://shopify/Order/${shopifyOrderId}`;

  // 1. Obtener fulfillment orders abiertas
  const orderData = await adminGql(
    `query($id: ID!) {
      order(id: $id) {
        fulfillmentOrders(first: 10) {
          edges { node { id status } }
        }
      }
    }`,
    { id: orderGid },
  );

  if (!orderData?.order) {
    console.warn(`⚠️  No se encontró la orden ${orderGid} en Shopify`);
    return null;
  }

  const open = orderData.order.fulfillmentOrders.edges
    .filter(e => e.node.status === 'OPEN')
    .map(e => ({ fulfillmentOrderId: e.node.id }));

  if (open.length === 0) {
    console.warn('⚠️  No hay fulfillment orders abiertas para esta orden');
    return null;
  }

  // 2. Crear el fulfillment
  const trackingInfo = trackingNumber
    ? { number: trackingNumber, company: trackingCompany || '', url: trackingUrl || '' }
    : undefined;

  const result = await adminGql(
    `mutation($fulfillment: FulfillmentV2Input!) {
      fulfillmentCreateV2(fulfillment: $fulfillment) {
        fulfillment { id status }
        userErrors { field message }
      }
    }`,
    {
      fulfillment: {
        lineItemsByFulfillmentOrder: open,
        ...(trackingInfo ? { trackingInfo } : {}),
        notifyCustomer: true,
      },
    },
  );

  const errs = result?.fulfillmentCreateV2?.userErrors;
  if (errs?.length > 0) {
    console.error('❌ Shopify fulfillment userError:', errs[0].message);
    return null;
  }

  const fulfillment = result?.fulfillmentCreateV2?.fulfillment;
  if (fulfillment) {
    console.log(`✅ Shopify fulfillment creado: ${fulfillment.id}`);
  }
  return fulfillment;
}

/* ── Cancelar fulfillment ─────────────────────────────────────────────────── */
export async function cancelShopifyOrder(shopifyOrderId) {
  if (!DOMAIN || !TOKEN) return null;

  const orderGid = shopifyOrderId.startsWith('gid://')
    ? shopifyOrderId
    : `gid://shopify/Order/${shopifyOrderId}`;

  const result = await adminGql(
    `mutation($id: ID!) {
      orderCancel(orderId: $id, reason: OTHER, notifyCustomer: true, refund: false, restock: true) {
        orderCancelUserErrors { field message }
      }
    }`,
    { id: orderGid },
  );

  const errs = result?.orderCancel?.orderCancelUserErrors;
  if (errs?.length > 0) {
    console.error('❌ Shopify cancel error:', errs[0].message);
    return null;
  }

  console.log(`✅ Orden ${shopifyOrderId} cancelada en Shopify`);
  return true;
}
