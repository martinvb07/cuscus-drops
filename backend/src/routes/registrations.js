import { Router } from 'express';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { randomUUID } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const router  = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR  = path.join(__dirname, '../../../data');
const DATA_FILE = path.join(DATA_DIR, 'registrations.json');

function ensureFile() {
  if (!existsSync(DATA_DIR))  mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(DATA_FILE)) writeFileSync(DATA_FILE, '[]', 'utf-8');
}

function read()         { ensureFile(); return JSON.parse(readFileSync(DATA_FILE, 'utf-8')); }
function save(data)     { writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8'); }

// POST /api/registrations
router.post('/', (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'El teléfono es requerido' });

  const data = read();
  if (data.some(r => r.phone === phone))
    return res.status(409).json({ error: 'Este número ya está registrado' });

  data.push({ id: randomUUID(), phone, created_at: new Date().toISOString() });
  save(data);
  res.status(201).json({ message: 'Registrado exitosamente' });
});

// GET /api/registrations
router.get('/', (_req, res) => {
  const data = read();
  res.json({ count: data.length, registrations: data });
});

// DELETE /api/registrations/:id
router.delete('/:id', (req, res) => {
  const data     = read();
  const filtered = data.filter(r => r.id !== req.params.id);
  if (filtered.length === data.length)
    return res.status(404).json({ error: 'No encontrado' });
  save(filtered);
  res.json({ message: 'Eliminado' });
});

export default router;
