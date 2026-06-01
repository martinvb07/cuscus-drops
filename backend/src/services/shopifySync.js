/**
 * Sincronización Shopify → MongoDB.
 * Jala órdenes directamente de la REST API de Shopify y hace upsert en la BD.
 * Útil antes de tener webhooks configurados o para resincronizar.
 */

import Order from '../models/Order.js';

const DOMAIN  = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN   = process.env.SHOPIFY_ADMIN_TOKEN;
const API_VER = '2025-01';

function mapFinancial(status) {
  const map = { authorized: 'authorized', paid: 'paid', refunded: 'refunded', voided: 'voided', partially_refunded: 'partially_refunded' };
  return map[status] || 'pending';
}

function mapFulfillment(status) {
  if (!status || status === 'null') return 'unfulfilled';
  if (status === 'fulfilled') return 'dispatched';
  if (status === 'partial')   return 'in_transit';
  return 'unfulfilled';
}

function shopifyOrderToDoc(o) {
  const shipping = o.shipping_address || {};
  const billing  = o.billing_address  || {};
  const customer = o.customer         || {};

  return {
    shopifyOrderId:     String(o.id),
    shopifyOrderNumber: o.order_number,
    customer: {
      firstName: customer.first_name || shipping.first_name || '',
      lastName:  customer.last_name  || shipping.last_name  || '',
      email:     o.email             || customer.email      || '',
      phone:     o.phone             || customer.phone      || shipping.phone || '',
    },
    shippingAddress: {
      firstName: shipping.first_name,
      lastName:  shipping.last_name,
      address1:  shipping.address1,
      address2:  shipping.address2,
      city:      shipping.city,
      province:  shipping.province,
      country:   shipping.country,
      zip:       shipping.zip,
      phone:     shipping.phone,
    },
    billingAddress: {
      firstName: billing.first_name,
      lastName:  billing.last_name,
      address1:  billing.address1,
      address2:  billing.address2,
      city:      billing.city,
      province:  billing.province,
      country:   billing.country,
      zip:       billing.zip,
    },
    lineItems: (o.line_items || []).map(item => ({
      shopifyLineItemId: String(item.id),
      title:             item.title,
      variantTitle:      item.variant_title,
      quantity:          item.quantity,
      price:             item.price,
      sku:               item.sku,
    })),
    totalPrice:       o.total_price,
    subtotalPrice:    o.subtotal_price,
    totalTax:         o.total_tax,
    currency:         o.currency,
    financialStatus:  mapFinancial(o.financial_status),
    fulfillmentStatus: mapFulfillment(o.fulfillment_status),
    shopifyCreatedAt: new Date(o.created_at),
  };
}

/**
 * Trae hasta `limit` órdenes de Shopify y las sincroniza en MongoDB.
 * Devuelve { synced, total, errors }.
 */
export async function syncOrdersFromShopify(limit = 250) {
  if (!DOMAIN || !TOKEN) throw new Error('SHOPIFY_STORE_DOMAIN o SHOPIFY_ADMIN_TOKEN no configurados');

  // test=false excluye órdenes de sandbox. financial_status=paid excluye las no procesadas.
  const url = `https://${DOMAIN}/admin/api/${API_VER}/orders.json?status=any&financial_status=paid&limit=${limit}&order=created_at+desc`;
  const res = await fetch(url, {
    headers: { 'X-Shopify-Access-Token': TOKEN },
    signal:  AbortSignal.timeout(20_000),
  });

  if (!res.ok) throw new Error(`Shopify REST API error: ${res.status} ${res.statusText}`);

  const { orders } = await res.json();
  if (!Array.isArray(orders)) throw new Error('Respuesta inesperada de Shopify');

  let synced = 0;
  let errors = 0;

  let skipped = 0;

  for (const o of orders) {
    if (o.test === true) { skipped++; continue; }
    try {
      const doc = shopifyOrderToDoc(o);
      await Order.findOneAndUpdate(
        { shopifyOrderId: doc.shopifyOrderId },
        { $set: doc },
        { upsert: true, new: true },
      );
      synced++;
    } catch {
      errors++;
    }
  }

  if (skipped > 0) console.log(`🧪 ${skipped} órdenes de test ignoradas`);
  return { synced, total: orders.length - skipped, errors, skipped };
}
