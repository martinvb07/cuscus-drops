export type DropPhase = 'pre-launch' | 'live' | 'sold-out';

// ← Cambiar este valor para cambiar la fase activa del drop
export const DROP_PHASE: DropPhase = 'pre-launch';

export const DROP_CONFIG: Record<
  DropPhase,
  {
    badge: string;
    showCountdown: boolean;
    showForm: boolean;
    showBuyButton: boolean;
  }
> = {
  'pre-launch': {
    badge: 'Pre-Launch',
    showCountdown: true,
    showForm: true,
    showBuyButton: false,
  },
  live: {
    badge: 'Drop Live',
    showCountdown: false,
    showForm: false,
    showBuyButton: true,
  },
  'sold-out': {
    badge: 'Sold Out',
    showCountdown: false,
    showForm: false,
    showBuyButton: false,
  },
};
