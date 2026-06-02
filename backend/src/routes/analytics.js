import { Router } from 'express';
import rateLimit  from 'express-rate-limit';
import Analytics  from '../models/Analytics.js';
import Order      from '../models/Order.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

const eventLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests' },
});

/* ── Public: track event (no auth — called from frontend) ─────────────────── */
router.post('/event', eventLimiter, async (req, res) => {
  try {
    const { event, data, sessionId } = req.body;
    const allowed = ['page_view', 'checkout_click', 'checkout_started'];
    if (!event || !allowed.includes(event)) {
      return res.status(400).json({ error: 'Invalid event' });
    }

    await Analytics.create({
      event,
      data:      data     || {},
      sessionId: sessionId || null,
      ip:        req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/* ── Admin: summary ───────────────────────────────────────────────────────── */
router.get('/summary', requireAdmin, async (_req, res) => {
  try {
    const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      pageViews,
      checkoutClicks,
      checkoutStarts,
      ordersLast30d,
      conversionData,
    ] = await Promise.all([
      Analytics.countDocuments({ event: 'page_view',       createdAt: { $gte: since30d } }),
      Analytics.countDocuments({ event: 'checkout_click',  createdAt: { $gte: since30d } }),
      Analytics.countDocuments({ event: 'checkout_started', createdAt: { $gte: since30d } }),
      Order.countDocuments({ financialStatus: 'paid',      createdAt: { $gte: since30d } }),

      // Daily conversion funnel — last 7 days
      Analytics.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
        {
          $group: {
            _id: {
              date:  { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              event: '$event',
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.date': 1 } },
      ]),
    ]);

    const conversionRate = checkoutClicks > 0
      ? Math.round((ordersLast30d / checkoutClicks) * 100)
      : 0;

    res.json({
      last30d: {
        pageViews,
        checkoutClicks,
        checkoutStarts,
        orders: ordersLast30d,
        conversionRate,
      },
      funnel: conversionData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
