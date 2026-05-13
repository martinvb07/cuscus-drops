const BASE  = 'https://graph.facebook.com/v20.0';
const BRAND = process.env.BRAND_URL || 'https://cuscushats.com';

const TEMPLATES = {
  reminder:
    `⏰ *Cuscus Hats* — El drop se acerca. Las unidades son limitadas, prepárate.\n\n🔗 ${BRAND}`,
  launch:
    `🎩 *¡El drop está LIVE!* Las gorras ya están disponibles. Entra ahora antes de que se agoten:\n\n🔗 ${BRAND}`,
  early_access:
    `⭐ *Acceso anticipado activado.* Eres parte del primer grupo en el drop de Cuscus Hats.\n\n🔗 ${BRAND}`,
};

export function isConfigured() {
  const id    = process.env.WA_PHONE_NUMBER_ID;
  const token = process.env.WA_ACCESS_TOKEN;
  return !!(id && token && id !== 'your_phone_number_id');
}

export function getTemplateText(templateId) {
  return TEMPLATES[templateId] ?? null;
}

export async function sendMessage(to, body) {
  const phone = to.replace(/[^\d]/g, '');

  const res = await fetch(`${BASE}/${process.env.WA_PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.WA_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type:    'individual',
      to:                phone,
      type:              'text',
      text:              { preview_url: false, body },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function sendCampaign(phones, text) {
  const results = { sent: 0, failed: 0, errors: [] };

  for (const phone of phones) {
    try {
      await sendMessage(phone, text);
      results.sent++;
      await new Promise(r => setTimeout(r, 120)); // respetar rate limit
    } catch (err) {
      results.failed++;
      results.errors.push({ phone, error: err.message });
    }
  }

  return results;
}
