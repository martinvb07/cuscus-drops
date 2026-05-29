/**
 * Auto-registro de webhooks en Shopify al arrancar el backend.
 * Si BACKEND_URL está configurado, registra todos los webhooks necesarios.
 * Si ya existen, los actualiza para apuntar a la URL correcta.
 */

const DOMAIN  = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN   = process.env.SHOPIFY_ADMIN_TOKEN;
const API_VER = '2025-01';

const REQUIRED_TOPICS = [
  'orders/create',
  'orders/paid',
  'orders/updated',
  'inventory_levels/update',
  'fulfillments/create',
];

async function shopifyRest(method, path, body) {
  const res = await fetch(`https://${DOMAIN}/admin/api/${API_VER}/${path}`, {
    method,
    headers: {
      'Content-Type':           'application/json',
      'X-Shopify-Access-Token': TOKEN,
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Shopify REST ${method} ${path} → ${res.status}: ${text}`);
  }
  return res.json();
}

export async function registerWebhooks() {
  const backendUrl = process.env.BACKEND_URL;

  if (!DOMAIN || !TOKEN) {
    console.log('⚠️  Webhooks: SHOPIFY_STORE_DOMAIN o SHOPIFY_ADMIN_TOKEN no configurados — omitiendo');
    return;
  }

  if (!backendUrl) {
    console.log('⚠️  Webhooks: BACKEND_URL no configurado — registro automático desactivado');
    console.log('   → En producción añade BACKEND_URL=https://api.cuscushats.com al .env');
    return;
  }

  const webhookAddress = `${backendUrl}/api/shopify/webhook`;

  try {
    // Obtener webhooks existentes
    const { webhooks: existing } = await shopifyRest('GET', 'webhooks.json?limit=50');
    const existingByTopic = Object.fromEntries(existing.map(w => [w.topic, w]));

    for (const topic of REQUIRED_TOPICS) {
      const existing = existingByTopic[topic];

      if (existing) {
        if (existing.address === webhookAddress) {
          console.log(`✅ Webhook ya configurado: ${topic}`);
        } else {
          // Actualizar URL si cambió (p.ej. al migrar de dev a prod)
          await shopifyRest('PUT', `webhooks/${existing.id}.json`, {
            webhook: { id: existing.id, address: webhookAddress },
          });
          console.log(`🔄 Webhook actualizado: ${topic} → ${webhookAddress}`);
        }
      } else {
        // Crear nuevo webhook
        await shopifyRest('POST', 'webhooks.json', {
          webhook: { topic, address: webhookAddress, format: 'json' },
        });
        console.log(`✅ Webhook creado: ${topic} → ${webhookAddress}`);
      }
    }

    console.log('🎯 Shopify webhooks configurados — órdenes sincronizarán en tiempo real');

    if (!process.env.SHOPIFY_WEBHOOK_SECRET) {
      console.log('');
      console.log('⚠️  SHOPIFY_WEBHOOK_SECRET no está configurado.');
      console.log('   → Ve a Shopify Admin → Settings → Notifications → Webhooks');
      console.log('   → Copia el "Signing secret" y añádelo al .env:');
      console.log('   SHOPIFY_WEBHOOK_SECRET=tu_secret_aquí');
      console.log('   → Luego reinicia el backend: pm2 restart cuscus-backend');
      console.log('');
    }
  } catch (err) {
    console.error(`❌ Error registrando webhooks: ${err.message}`);
  }
}
