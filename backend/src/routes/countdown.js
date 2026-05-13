import { Router } from 'express';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../../data');
const COUNTDOWN_FILE = path.join(DATA_DIR, 'countdown.json');

function getDefaultTarget() {
  return Date.now() + 14 * 24 * 60 * 60 * 1000;
}

function ensureCountdownFile() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(COUNTDOWN_FILE)) {
    writeFileSync(
      COUNTDOWN_FILE,
      JSON.stringify({ targetDate: getDefaultTarget() }),
      'utf-8'
    );
  }
}

// GET /api/countdown — get drop target date
router.get('/', (_req, res) => {
  ensureCountdownFile();
  const data = JSON.parse(readFileSync(COUNTDOWN_FILE, 'utf-8'));
  res.json({ targetDate: data.targetDate });
});

// PUT /api/countdown — update drop target date (admin)
router.put('/', (req, res) => {
  const { targetDate } = req.body;
  const parsed = new Date(targetDate);
  if (!targetDate || isNaN(parsed.getTime())) {
    return res.status(400).json({ error: 'targetDate inválido' });
  }
  ensureCountdownFile();
  writeFileSync(
    COUNTDOWN_FILE,
    JSON.stringify({ targetDate: parsed.getTime() }),
    'utf-8'
  );
  res.json({ targetDate: parsed.getTime() });
});

export default router;
