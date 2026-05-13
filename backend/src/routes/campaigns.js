import { Router }                       from 'express';
import { readFileSync, existsSync }      from 'fs';
import path                              from 'path';
import { fileURLToPath }                 from 'url';
import { sendCampaign, getStatus }       from '../services/whatsappBaileys.js';

const router    = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '../../../data/registrations.json');

// POST /api/campaigns/send
router.post('/send', async (req, res) => {
  const { message } = req.body;
  if (!message?.trim())
    return res.status(400).json({ error: 'message requerido' });

  const { state } = getStatus();
  if (state !== 'connected')
    return res.status(400).json({ error: 'WhatsApp no conectado. Escanea el QR primero.' });

  const data   = existsSync(DATA_FILE) ? JSON.parse(readFileSync(DATA_FILE, 'utf-8')) : [];
  const phones = data.map(r => r.phone).filter(Boolean);

  if (phones.length === 0)
    return res.json({ sent: 0, failed: 0, message: 'Sin números registrados' });

  try {
    const results = await sendCampaign(phones, message.trim());
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
