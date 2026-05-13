import { Server } from 'socket.io';
import { getDropState, setDropState } from '../state/dropState.js';
import { getStatus as getWAStatus, getQR, waEvents } from '../services/whatsappBaileys.js';

let io = null;

export function createSocketServer(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  // Wire Baileys events → socket broadcasts
  waEvents.on('status', data  => { if (io) io.emit('wa:status', data); });
  waEvents.on('qr',     data  => { if (io) io.emit('wa:qr', data); });
  waEvents.on('campaign:progress', data => { if (io) io.emit('campaign:progress', data); });

  io.on('connection', socket => {
    // Send current state to newly connected client
    socket.emit('wa:status', getWAStatus());
    socket.emit('drop:state', getDropState());
    const qr = getQR();
    if (qr) socket.emit('wa:qr', { qr });

    // Admin sets drop state
    socket.on('drop:set', ({ stage }) => {
      if (stage !== 'pre_drop' && stage !== 'sold_out') return;
      const state = setDropState(stage);
      io.emit('drop:state', state); // broadcast to ALL clients (landing + admin)
    });
  });

  return io;
}

export function getIO() { return io; }
