import { Router } from 'express';
import crypto     from 'crypto';
import Order      from '../models/Order.js';

const router = Router();

const STOCK_TOTAL = 100;

// Verificar firma HMAC de Shopify
function verifyHmac(rawBody, hmacHeader) {
  const hash = crypto
    .createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET || '')
    .update(rawBody, 'utf8')
    .digest('base64');
  return hash === hmacHeader;
}

// POST /api/shopify/webhook
// Shopify envía aquí los eventos de órdenes
router.post('/webhook', async (req, res) => {
  const hmac  = req.headers['x-shopify-hmac-sha256'];
  const topic = req.headers['x-shopify-topic'];

  // Verificar autenticidad del webhook
  if (!verifyHmac(req.rawBody, hmac)) {
    return res.status(401).send('Unauthorized');
  }

  const data = req.body;

  try {
    if (topic === 'orders/create' || topic === 'orders/paid') {
      await upsertOrder(data);
    } else if (topic === 'orders/updated') {
      await updateOrderStatus(data);
    } else if (topic === 'inventory_levels/update') {
      await updateInventoryCache(data);
    } else if (topic === 'fulfillments/create') {
      await handleFulfillmentCreated(data);
    }
    res.status(200).send('OK');
  } catch (err) {
    console.error('❌ Webhook error:', err.message);
    res.status(500).send('Error');
  }
});

async function upsertOrder(shopifyOrder) {
  const shipping  = shopifyOrder.shipping_address || {};
  const billing   = shopifyOrder.billing_address  || {};
  const customer  = shopifyOrder.customer || {};

  const doc = {
    shopifyOrderId:     String(shopifyOrder.id),
    shopifyOrderNumber: shopifyOrder.order_number,
    customer: {
      firstName: customer.first_name || shipping.first_name || '',
      lastName:  customer.last_name  || shipping.last_name  || '',
      email:     shopifyOrder.email  || customer.email      || '',
      phone:     shopifyOrder.phone  || customer.phone      || shipping.phone || '',
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
    lineItems: (shopifyOrder.line_items || []).map(item => ({
      shopifyLineItemId: String(item.id),
      title:             item.title,
      variantTitle:      item.variant_title,
      quantity:          item.quantity,
      price:             item.price,
      sku:               item.sku,
    })),
    totalPrice:       shopifyOrder.total_price,
    subtotalPrice:    shopifyOrder.subtotal_price,
    totalTax:         shopifyOrder.total_tax,
    currency:         shopifyOrder.currency,
    financialStatus:  mapFinancial(shopifyOrder.financial_status),
    fulfillmentStatus: mapFulfillment(shopifyOrder.fulfillment_status),
    shopifyCreatedAt: new Date(shopifyOrder.created_at),
  };

  await Order.findOneAndUpdate(
    { shopifyOrderId: doc.shopifyOrderId },
    { $set: doc },
    { upsert: true, new: true }
  );

  console.log(`✅ Orden #${doc.shopifyOrderNumber} registrada (${doc.financialStatus})`);
}

async function updateOrderStatus(shopifyOrder) {
  await Order.findOneAndUpdate(
    { shopifyOrderId: String(shopifyOrder.id) },
    {
      $set: {
        financialStatus:  mapFinancial(shopifyOrder.financial_status),
        fulfillmentStatus: mapFulfillment(shopifyOrder.fulfillment_status),
      },
    }
  );
}

async function updateInventoryCache(data) {
  // Store latest inventory level for fast reads
  await Order.db.collection('inventory_cache').updateOne(
    { inventoryItemId: String(data.inventory_item_id) },
    {
      $set: {
        inventoryItemId: String(data.inventory_item_id),
        locationId:      String(data.location_id),
        available:       data.available,
        updatedAt:       new Date(),
      },
    },
    { upsert: true },
  );
  console.log(`📦 Inventario actualizado: ${data.available} disponibles`);
}

async function handleFulfillmentCreated(data) {
  const shopifyOrderId = String(data.order_id);
  const update = {
    fulfillmentStatus: 'dispatched',
    dispatchedAt:      new Date(),
  };
  if (data.tracking_number)  update.trackingNumber  = data.tracking_number;
  if (data.tracking_company) update.trackingCompany = data.tracking_company;
  if (data.tracking_url)     update.trackingUrl     = data.tracking_url;

  await Order.findOneAndUpdate({ shopifyOrderId }, { $set: update });
  console.log(`🚚 Fulfillment creado para orden ${shopifyOrderId}`);
}

function mapFinancial(status) {
  const map = { authorized: 'authorized', paid: 'paid', refunded: 'refunded', voided: 'voided', partially_refunded: 'partially_refunded' };
  return map[status] || 'pending';
}

function mapFulfillment(status) {
  if (!status || status === 'null') return 'unfulfilled';
  if (status === 'fulfilled') return 'dispatched';
  return 'unfulfilled';
}

export default router;
