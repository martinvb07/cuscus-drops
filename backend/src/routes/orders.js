import { Router }  from 'express';
import mongoose     from 'mongoose';
import Order        from '../models/Order.js';
import { requireAdmin }            from '../middleware/auth.js';
import { createShopifyFulfillment, cancelShopifyOrder } from '../services/shopifyAdmin.js';

const ALLOWED_FINANCIAL   = new Set(['pending','authorized','paid','partially_refunded','refunded','voided']);
const ALLOWED_FULFILLMENT = new Set(['unfulfilled','in_transit','dispatched','delivered','cancelled']);
const ALLOWED_SORTS       = new Set(['-createdAt','createdAt','-shopifyCreatedAt','shopifyCreatedAt','shopifyOrderNumber','-shopifyOrderNumber']);
const MAX_LIMIT = 100;

function validObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

const router = Router();
router.use(requireAdmin);

const STOCK_TOTAL = Number(process.env.STOCK_TOTAL ?? 100);

async function getShopifyInventory() {
  try {
    const domain  = process.env.SHOPIFY_STORE_DOMAIN;
    const token   = process.env.SHOPIFY_ADMIN_TOKEN;
    const variant = process.env.SHOPIFY_VARIANT_ID?.split('/').pop();
    if (!domain || !token || !variant) return null;
    const res = await fetch(
      `https://${domain}/admin/api/2025-01/variants/${variant}.json`,
      { headers: { 'X-Shopify-Access-Token': token }, signal: AbortSignal.timeout(5_000) },
    );
    if (!res.ok) return null;
    const { variant: v } = await res.json();
    return v?.inventory_quantity ?? null;
  } catch { return null; }
}

// GET /api/orders/stats  — Dashboard
router.get('/stats', async (_req, res) => {
  try {
    const [total, paid, authorized, dispatched, delivered, revenue, shopifyAvailable] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ financialStatus: 'paid' }),
      Order.countDocuments({ financialStatus: 'authorized' }),
      Order.countDocuments({ fulfillmentStatus: 'dispatched' }),
      Order.countDocuments({ fulfillmentStatus: 'delivered' }),
      Order.aggregate([
        { $match: { financialStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: { $toDouble: '$totalPrice' } } } },
      ]),
      getShopifyInventory(),
    ]);

    const available = shopifyAvailable ?? Math.max(0, STOCK_TOTAL - paid - authorized);

    res.json({
      total,
      paid,
      authorized,
      pending: total - paid - authorized,
      dispatched,
      delivered,
      available,
      stockTotal: STOCK_TOTAL,
      revenue: revenue[0]?.total ?? 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/orders  — Listar órdenes con filtros y paginación
router.get('/', async (req, res) => {
  try {
    const rawPage  = Math.max(1, parseInt(req.query.page,  10) || 1);
    const rawLimit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit, 10) || 50));
    const safeSort = ALLOWED_SORTS.has(req.query.sort) ? req.query.sort : '-createdAt';

    const filter = {};
    // Validar contra allowlist — previene NoSQL injection via ?financial[$ne]=paid
    if (req.query.financial   && ALLOWED_FINANCIAL.has(String(req.query.financial)))   filter.financialStatus  = String(req.query.financial);
    if (req.query.fulfillment && ALLOWED_FULFILLMENT.has(String(req.query.fulfillment))) filter.fulfillmentStatus = String(req.query.fulfillment);
    if (req.query.search) {
      const escaped = String(req.query.search).slice(0, 200).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(escaped, 'i');
      filter.$or = [
        { 'customer.firstName': re },
        { 'customer.lastName':  re },
        { 'customer.email':     re },
        { 'customer.phone':     re },
        { trackingNumber:       re },
      ];
    }

    const skip  = (rawPage - 1) * rawLimit;
    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort(safeSort)
      .skip(skip)
      .limit(rawLimit)
      .lean();

    res.json({ orders, total, page: rawPage, pages: Math.ceil(total / rawLimit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/orders/export.csv  — Exportar para despacho
router.get('/export.csv', async (_req, res) => {
  try {
    const orders = await Order.find({ financialStatus: 'paid' }).sort('-createdAt').lean();

    const header = [
      '# Orden', 'Nombres', 'Apellidos', 'Email', 'Teléfono',
      'Dirección', 'Ciudad', 'Dpto', 'País', 'Código Postal',
      'Producto', 'Cantidad', 'Total', 'Moneda',
      'Estado Pago', 'Estado Despacho', 'Guía', 'Transportadora', 'Fecha',
    ].join(',');

    const rows = orders.map(o => {
      const sa = o.shippingAddress || {};
      const item = o.lineItems?.[0] || {};
      return [
        o.shopifyOrderNumber,
        `"${o.customer?.firstName || ''}"`,
        `"${o.customer?.lastName  || ''}"`,
        `"${o.customer?.email     || ''}"`,
        `"${o.customer?.phone     || ''}"`,
        `"${(`${sa.address1 || ''} ${sa.address2 || ''}`).trim()}"`,
        `"${sa.city     || ''}"`,
        `"${sa.province || ''}"`,
        `"${sa.country  || ''}"`,
        `"${sa.zip      || ''}"`,
        `"${item.title  || ''}"`,
        item.quantity ?? 1,
        o.totalPrice,
        o.currency,
        o.financialStatus,
        o.fulfillmentStatus,
        `"${o.trackingNumber  || ''}"`,
        `"${o.trackingCompany || ''}"`,
        new Date(o.shopifyCreatedAt || o.createdAt).toLocaleDateString('es-CO'),
      ].join(',');
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="ordenes-cuscus.csv"');
    res.send('﻿' + [header, ...rows].join('\n'));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/orders/customers  — clientes únicos agrupados por email
router.get('/customers', async (_req, res) => {
  try {
    const customers = await Order.aggregate([
      {
        $group: {
          _id:         '$customer.email',
          firstName:   { $last: '$customer.firstName' },
          lastName:    { $last: '$customer.lastName' },
          email:       { $last: '$customer.email' },
          phone:       { $last: '$customer.phone' },
          city:        { $last: '$shippingAddress.city' },
          country:     { $last: '$shippingAddress.country' },
          totalOrders: { $sum: 1 },
          totalSpent:  { $sum: { $toDouble: '$totalPrice' } },
          lastOrder:   { $max: '$shopifyCreatedAt' },
        },
      },
      { $sort: { lastOrder: -1 } },
    ]);
    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  if (!validObjectId(req.params.id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PATCH /api/orders/:id  — Actualizar estado, tracking, notas
router.patch('/:id', async (req, res) => {
  if (!validObjectId(req.params.id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  try {
    const { fulfillmentStatus, trackingNumber, trackingCompany, trackingUrl, adminNotes } = req.body;

    if (fulfillmentStatus && !ALLOWED_FULFILLMENT.has(fulfillmentStatus)) {
      return res.status(400).json({ error: 'Estado de fulfillment inválido' });
    }

    const update = {};
    if (fulfillmentStatus)  update.fulfillmentStatus = fulfillmentStatus;
    if (trackingNumber)     update.trackingNumber     = trackingNumber;
    if (trackingCompany)    update.trackingCompany    = trackingCompany;
    if (trackingUrl)        update.trackingUrl        = trackingUrl;
    if (adminNotes !== undefined) update.adminNotes   = adminNotes;

    if (fulfillmentStatus === 'dispatched') update.dispatchedAt = new Date();
    if (fulfillmentStatus === 'delivered')  update.deliveredAt  = new Date();

    const order = await Order.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
    if (!order) return res.status(404).json({ error: 'Orden no encontrada' });

    // ── Sync Cuscus → Shopify ─────────────────────────────────────────────
    if (fulfillmentStatus === 'dispatched' && order.shopifyOrderId) {
      // Fire-and-forget: no bloquea la respuesta al admin
      createShopifyFulfillment({
        shopifyOrderId:  order.shopifyOrderId,
        trackingNumber:  update.trackingNumber  || order.trackingNumber  || '',
        trackingCompany: update.trackingCompany || order.trackingCompany || '',
        trackingUrl:     update.trackingUrl     || order.trackingUrl     || '',
      }).catch(err => console.error('❌ Shopify sync:', err.message));
    }

    if (fulfillmentStatus === 'cancelled' && order.shopifyOrderId) {
      cancelShopifyOrder(order.shopifyOrderId)
        .catch(err => console.error('❌ Shopify cancel sync:', err.message));
    }
    // ─────────────────────────────────────────────────────────────────────

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
