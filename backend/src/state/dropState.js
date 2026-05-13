import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR   = path.join(__dirname, '../../../data');
const STATE_FILE = path.join(DATA_DIR, 'drop_state.json');

function ensure() {
  if (!existsSync(DATA_DIR))   mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(STATE_FILE)) writeFileSync(STATE_FILE, JSON.stringify({ stage: 'pre_drop' }), 'utf-8');
}

export function getDropState() {
  ensure();
  return JSON.parse(readFileSync(STATE_FILE, 'utf-8'));
}

export function setDropState(stage) {
  ensure();
  const state = { stage };
  writeFileSync(STATE_FILE, JSON.stringify(state), 'utf-8');
  return state;
}
