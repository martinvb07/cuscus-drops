import makeWASocket, { useMultiFileAuthState, DisconnectReason, Browsers } from '@whiskeysockets/baileys';
import QRCode        from 'qrcode';
import pino          from 'pino';
import { EventEmitter } from 'events';
import path          from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync, existsSync, rmSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUTH_DIR  = path.join(__dirname, '../../../data/baileys_auth');
const logger    = pino({ level: 'silent' });

export const waEvents = new EventEmitter();

let sock              = null;
let currentQR         = null;
let state             = 'disconnected';
let reconnectAttempts = 0;
let autoReconnect     = true;

function emit(event, data) {
  waEvents.emit(event, data);
}

export function getStatus() { return { state, hasQR: !!currentQR }; }
export function getQR()     { return currentQR; }

export async function connect() {
  if (!existsSync(AUTH_DIR)) mkdirSync(AUTH_DIR, { recursive: true });

  const { state: authState, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

  state         = 'connecting';
  currentQR     = null;
  autoReconnect = true;

  emit('status', { state, hasQR: false });

  sock = makeWASocket({
    auth:                  authState,
    printQRInTerminal:     false,
    browser:               Browsers.ubuntu('Chrome'),
    logger,
    connectTimeoutMs:      30000,
    defaultQueryTimeoutMs: 30000,
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      try { currentQR = await QRCode.toDataURL(qr); } catch {}
      state = 'connecting';
      emit('status', { state, hasQR: true });
      emit('qr', { qr: currentQR });
    }

    if (connection === 'open') {
      currentQR         = null;
      state             = 'connected';
      reconnectAttempts = 0;
      emit('status', { state, hasQR: false });
      console.log('🟢 WhatsApp conectado');
    }

    if (connection === 'close') {
      const code      = lastDisconnect?.error?.output?.statusCode;
      const loggedOut = code === DisconnectReason.loggedOut;

      if (loggedOut || !autoReconnect) {
        state     = 'disconnected';
        currentQR = null;
        sock      = null;
        emit('status', { state, hasQR: false });
        console.log('🔴 WhatsApp desconectado');
      } else {
        state = 'reconnecting';
        emit('status', { state, hasQR: false });
        reconnectAttempts++;
        const delay = Math.min(3000 * reconnectAttempts, 30000);
        console.log(`🟡 Reconectando en ${delay}ms...`);
        setTimeout(connect, delay);
      }
    }
  });
}

export async function disconnect() {
  autoReconnect = false;
  if (sock) {
    try { await sock.logout(); } catch {}
    sock = null;
  }
  if (existsSync(AUTH_DIR)) rmSync(AUTH_DIR, { recursive: true, force: true });
  state     = 'disconnected';
  currentQR = null;
  reconnectAttempts = 0;
  emit('status', { state, hasQR: false });
}

function interpolate(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
}

export async function sendMessage(phone, template) {
  if (!sock || state !== 'connected') throw new Error('WhatsApp no conectado');
  const cleaned = phone.replace(/[^\d]/g, '');
  const jid     = `${cleaned}@s.whatsapp.net`;
  const text    = interpolate(template, { phone: cleaned });
  await sock.sendMessage(jid, { text });
}

export async function sendCampaign(phones, template) {
  const results = { sent: 0, failed: 0, errors: [] };
  const total   = phones.length;

  emit('campaign:progress', { total, sent: 0, failed: 0, current: null, done: false });

  for (const phone of phones) {
    emit('campaign:progress', { total, sent: results.sent, failed: results.failed, current: phone, done: false });
    try {
      await sendMessage(phone, template);
      results.sent++;
      await new Promise(r => setTimeout(r, 1200));
    } catch (err) {
      results.failed++;
      results.errors.push({ phone, error: err.message });
    }
  }

  emit('campaign:progress', { total, sent: results.sent, failed: results.failed, current: null, done: true });
  return results;
}
