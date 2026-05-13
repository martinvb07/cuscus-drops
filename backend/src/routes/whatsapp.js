import { Router } from 'express';
import { getStatus, getQR, connect, disconnect } from '../services/whatsappBaileys.js';

const router = Router();

// GET /api/whatsapp/status
router.get('/status', (_req, res) => res.json(getStatus()));

// GET /api/whatsapp/qr
router.get('/qr', (_req, res) => {
  const qr = getQR();
  if (!qr) return res.status(404).json({ error: 'No hay QR disponible' });
  res.json({ qr });
});

// POST /api/whatsapp/connect
router.post('/connect', async (_req, res) => {
  try {
    await connect();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/whatsapp/disconnect
router.post('/disconnect', async (_req, res) => {
  try {
    await disconnect();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
