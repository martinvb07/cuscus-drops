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

// Logging HTTP — timestamp + método + ruta + status + duración
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    const level = res.statusCode >= 500 ? '❌' : res.statusCode >= 400 ? '⚠️ ' : '✅';
    console.log(`${level} [${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} +${ms}ms`);
  });
  next();
});

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3001',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error(`CORS bloqueado: ${origin}`));
  },
}));

// Guardar rawBody para verificación HMAC del webhook de Shopify
const MAX_BODY = 1_000_000; // 1 MB
app.use((req, res, next) => {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
    if (data.length > MAX_BODY) {
      res.status(413).end('Payload Too Large');
    }
  });
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
    console.error(`⚠️  MongoDB no disponible: ${err.message}`);
    console.error('   → Órdenes y analíticas no funcionarán hasta conectar MongoDB Atlas.');
    console.error('   → Shopify Admin API sigue operativa.');
    // En producción con Atlas esto nunca debería ocurrir.
    // En desarrollo local el servidor sigue corriendo para poder usar las rutas de Shopify.
    if (process.env.NODE_ENV === 'production') process.exit(1);
  });
