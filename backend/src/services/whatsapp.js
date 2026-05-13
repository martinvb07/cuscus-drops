import twilio from 'twilio';

const TEMPLATES = {
  reminder: (url) =>
    `⏰ *Cuscus Hats* — El drop se acerca. Las unidades son limitadas, prepárate.\n\n🔗 ${url}`,
  launch: (url) =>
    `🎩 *¡El drop está LIVE!* Las gorras de Cuscus Hats ya están disponibles. Entra ahora antes de que se agoten:\n\n🔗 ${url}`,
  early_access: (url) =>
    `⭐ *Acceso anticipado activado.* Eres parte del primer grupo en acceder al drop de Cuscus Hats.\n\n🔗 ${url}`,
};

export async function sendCampaign(phones, template, customMessage) {
  const sid   = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from  = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
  const url   = process.env.BRAND_URL || 'https://cuscushats.com';

  if (!sid || !token || sid.startsWith('AC' + 'xxx')) {
    throw new Error('Twilio no configurado. Añade TWILIO_ACCOUNT_SID y TWILIO_AUTH_TOKEN en .env');
  }

  const text = customMessage || TEMPLATES[template]?.(url);
  if (!text) throw new Error(`Template "${template}" no existe`);

  const client  = twilio(sid, token);
  const results = { sent: 0, failed: 0, errors: [] };

  for (const phone of phones) {
    try {
      await client.messages.create({
        from,
        to: `whatsapp:${phone}`,
        body: text,
      });
      results.sent++;
      await new Promise(r => setTimeout(r, 150));
    } catch (err) {
      results.failed++;
      results.errors.push({ phone, error: err.message });
    }
  }

  return results;
}
