import express   from 'express';
import cors      from 'cors';
import dotenv    from 'dotenv';
import { connectDB } from './db/connection.js';
import ordersRouter  from './routes/orders.js';
import shopifyRouter from './routes/shopify.js';

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

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'fase2' }));
app.use('/api/orders',          ordersRouter);
app.use('/api/shopify',         shopifyRouter);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🎩 Cuscus Hats Fase 2 backend → http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB:', err.message);
    process.exit(1);
  });
