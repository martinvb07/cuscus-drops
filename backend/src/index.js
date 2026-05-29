import express   from 'express';
import cors      from 'cors';
import dotenv    from 'dotenv';
import { connectDB } from './db/connection.js';
import ordersRouter    from './routes/orders.js';
import shopifyRouter   from './routes/shopify.js';
import analyticsRouter from './routes/analytics.js';
import syncRouter      from './routes/sync.js';
import { registerWebhooks } from './services/shopifyWebhooks.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 4001;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3001' }));

// Guardar rawBody para verificación HMAC del webhook de Shopify
app.use((req, _res, next) => {
  let data = '';
  req.on('data', chunk => { data += chunk; });
  req.on('end', () => {
    req.rawBody = data;
    try { req.body = JSON.parse(data); } catch { req.body = {}; }
    next();
  });
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'cuscus-hats', ts: new Date().toISOString() }));
app.use('/api/orders',    ordersRouter);
app.use('/api/shopify',   shopifyRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/sync',      syncRouter);

app.listen(PORT, () => {
  console.log(`🎩 Cuscus Hats backend → http://localhost:${PORT}`);
});

connectDB()
  .then(() => {
    console.log('✅ MongoDB conectado');
    registerWebhooks();
  })
  .catch(err => {
    console.error(`❌ MongoDB no disponible: ${err.message}`);
    process.exit(1);
  });
