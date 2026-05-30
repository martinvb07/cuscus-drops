'use client';

import Image        from 'next/image';
import Link         from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense }  from 'react';

type Status = 'paid' | 'pending' | 'cancelled' | 'unknown';

const CONFIG: Record<Status, { label: string; title: string; body: string; color: string }> = {
  paid: {
    label: '✓  Pago confirmado',
    title: 'Gracias.',
    body:  'Tu gorra Drop #1 está reservada.\nRecibirás un correo con los detalles del envío.',
    color: 'rgba(62,207,142,0.85)',
  },
  pending: {
    label: '⏳  Pago en proceso',
    title: 'Recibido.',
    body:  'Tu pago está siendo verificado.\nTe notificaremos cuando se confirme.',
    color: 'rgba(245,200,66,0.85)',
  },
  cancelled: {
    label: '✕  Pago cancelado',
    title: 'Cancelado.',
    body:  'El proceso de pago fue cancelado.\nSi fue un error, vuelve a intentarlo.',
    color: 'rgba(224,92,92,0.85)',
  },
  unknown: {
    label: '✓  Orden recibida',
    title: 'Gracias.',
    body:  'Hemos recibido tu solicitud.\nRecibirás un correo de confirmación pronto.',
    color: 'rgba(62,207,142,0.85)',
  },
};

function SuccessContent() {
  const params = useSearchParams();

  // Shopify manda: financial_status, order_id, checkout_id, key
  const financialStatus = params.get('financial_status');
  const orderId         = params.get('order_id');
  const checkoutId      = params.get('checkout_id');

  let status: Status = 'unknown';
  if (financialStatus === 'paid' || financialStatus === 'authorized') status = 'paid';
  else if (financialStatus === 'pending')                               status = 'pending';
  else if (financialStatus === 'voided' || financialStatus === 'cancelled') status = 'cancelled';
  else if (orderId || checkoutId)                                       status = 'paid';

  const cfg = CONFIG[status];
  const isFailed = status === 'cancelled';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-10"
      style={{ background: 'var(--ink)' }}>

      <Image src="/LOGO_FINAL.png" alt="Cuscus Hats" width={44} height={44}
        style={{ filter: 'brightness(0) invert(1)', opacity: 0.72 }} priority />

      <div style={{ width: '32px', height: '1px', background: 'rgba(235,230,219,0.18)' }} />

      <div className="flex flex-col items-center gap-4 max-w-[420px]">
        <span className="font-mono uppercase" style={{ fontSize: '7px', letterSpacing: '0.52em', color: cfg.color }}>
          {cfg.label}
        </span>

        <h1 className="font-bebas text-bone" style={{ fontSize: 'clamp(52px, 9vw, 80px)', letterSpacing: '0.04em', lineHeight: 0.88 }}>
          {cfg.title}
        </h1>

        <p className="font-garamond italic text-bone-3" style={{ fontSize: '16px', lineHeight: 1.65, opacity: 0.72, whiteSpace: 'pre-line' }}>
          {cfg.body}
        </p>

        {orderId && (
          <p className="font-mono uppercase" style={{ fontSize: '6.5px', letterSpacing: '0.32em', color: 'rgba(235,230,219,0.25)', marginTop: '4px' }}>
            Orden #{orderId}
          </p>
        )}
      </div>

      <div style={{ width: '32px', height: '1px', background: 'rgba(235,230,219,0.10)' }} />

      <div className="flex flex-col items-center gap-2">
        <p className="font-mono uppercase" style={{ fontSize: '7px', letterSpacing: '0.30em', color: 'rgba(235,230,219,0.32)' }}>
          {isFailed ? 'Soporte' : 'Seguimiento del pedido'}
        </p>
        <a href="https://instagram.com/cuscushats_" target="_blank" rel="noopener noreferrer"
          className="font-mono uppercase text-bone-3 transition-colors duration-300 hover:text-bone"
          style={{ fontSize: '8px', letterSpacing: '0.28em' }}>
          @cuscushats_
        </a>
      </div>

      <Link href={isFailed ? '/' : '/'}
        className="font-mono uppercase text-bone-3 transition-all duration-400 hover:text-bone"
        style={{ fontSize: '7.5px', letterSpacing: '0.36em', border: '1px solid rgba(235,230,219,0.16)', padding: '11px 20px' }}>
        {isFailed ? 'Intentar de nuevo' : 'Volver al inicio'}
      </Link>

    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--ink)' }}>
        <span className="font-mono text-bone-3 text-[8px] tracking-[0.4em] uppercase opacity-40">Cargando...</span>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
