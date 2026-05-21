import { Router }  from 'express';
import Order        from '../models/Order.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();
router.use(requireAdmin);

const STOCK_TOTAL = 100;

// GET /api/orders/stats  — Dashboard
router.get('/stats', async (_req, res) => {
  try {
    const [total, paid, dispatched, delivered, revenue] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ financialStatus: 'paid' }),
      Order.countDocuments({ fulfillmentStatus: 'dispatched' }),
      Order.countDocuments({ fulfillmentStatus: 'delivered' }),
      Order.aggregate([
        { $match: { financialStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: { $toDouble: '$totalPrice' } } } },
      ]),
    ]);

    res.json({
      total,
      paid,
      pending: total - paid,
      dispatched,
      delivered,
      available: Math.max(0, STOCK_TOTAL - paid),
      stockTotal: STOCK_TOTAL,
      revenue: revenue[0]?.total ?? 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders  — Listar órdenes con filtros y paginación
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      financial,
      fulfillment,
      search,
      sort = '-createdAt',
    } = req.query;

    const filter = {};
    if (financial)   filter.financialStatus  = financial;
    if (fulfillment) filter.fulfillmentStatus = fulfillment;
    if (search) {
      const re = new RegExp(search, 'i');
      filter.$or = [
        { 'customer.firstName': re },
        { 'customer.lastName':  re },
        { 'customer.email':     re },
        { 'customer.phone':     re },
        { trackingNumber:       re },
      ];
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
        `"${sa.address1 || ''} ${sa.address2 || ''}".trim()`,
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
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/orders/:id  — Actualizar estado, tracking, notas
router.patch('/:id', async (req, res) => {
  try {
    const { fulfillmentStatus, trackingNumber, trackingCompany, trackingUrl, adminNotes } = req.body;

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
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
