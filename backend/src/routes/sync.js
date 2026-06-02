import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { syncOrdersFromShopify } from '../services/shopifySync.js';

const router = Router();
router.use(requireAdmin);

// POST /api/sync/orders
// Importa/actualiza todas las órdenes de Shopify en MongoDB
router.post('/orders', async (_req, res) => {
  try {
    const result = await syncOrdersFromShopify(250);
    console.log(`🔄 Sync: ${result.synced}/${result.total} órdenes (${result.errors} errores)`);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
