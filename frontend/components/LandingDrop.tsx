'use client';

import { useState, useEffect } from 'react';
import { io }    from 'socket.io-client';
import Image     from 'next/image';
import SignupForm from './SignupForm';
import Countdown from './Countdown';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

type Stage = 'pre_drop' | 'sold_out';

// ── Sold Out ──────────────────────────────────────────────────────────────────

function SoldOutView() {
  useEffect(() => {
    const main = document.querySelector<HTMLElement>('main');
    if (!main) return;
    main.style.justifyContent = 'flex-start';
    main.style.paddingTop     = '10vh';
    return () => {
      main.style.justifyContent = '';
      main.style.paddingTop     = '';
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes so-rule {
          from { transform: scaleX(0); opacity: 0; }
          to   { transform: scaleX(1); opacity: 1; }
        }
        @keyframes so-rise {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes so-reveal {
          from { opacity: 0; letter-spacing: 0.54em; }
          to   { opacity: 1; letter-spacing: 0.44em; }
        }
        @keyframes so-breathe {
          0%,100% {
            opacity: 0.84;
            filter: drop-shadow(0 0 32px rgba(235,230,219,0.22));
          }
          50% {
            opacity: 1;
            filter: drop-shadow(0 0 62px rgba(235,230,219,0.46));
          }
        }
        @keyframes so-logo {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes so-shine {
          from { background-position: 0% 50%; }
          to   { background-position: 100% 50%; }
        }
        @keyframes so-float-a {
          0%,100% { transform: translateY(0px)   translateX(0px);  opacity: 0.12; }
          35%     { transform: translateY(-9px)  translateX(4px);  opacity: 0.28; }
          70%     { transform: translateY(-4px)  translateX(-6px); opacity: 0.07; }
        }
        @keyframes so-float-b {
          0%,100% { transform: translateY(0px)  translateX(0px);  opacity: 0.07; }
          50%     { transform: translateY(11px) translateX(-5px); opacity: 0.22; }
        }
        @keyframes so-float-c {
          0%,100% { transform: translateY(0px) translateX(0px);  opacity: 0.14; }
          40%     { transform: translateY(-7px) translateX(7px); opacity: 0.05; }
          75%     { transform: translateY(5px)  translateX(-3px); opacity: 0.24; }
        }
      `}</style>

      <div className="flex flex-col items-center text-center w-full" style={{ gap: 0, marginTop: '2px', position: 'relative' }}>

        {/* Micro-partículas ambientales */}
        <div aria-hidden style={{ position: 'absolute', inset: '-20px -50px', pointerEvents: 'none', zIndex: 0 }}>
          {[
            { top: '28%', left: '10%',  size: 1.5, delay: '0s',   dur: '7.2s',  anim: 'so-float-a' },
            { top: '52%', left: '84%',  size: 1,   delay: '2.5s', dur: '9.8s',  anim: 'so-float-b' },
            { top: '16%', left: '72%',  size: 1,   delay: '1.1s', dur: '11s',   anim: 'so-float-c' },
            { top: '74%', left: '20%',  size: 1.5, delay: '3.7s', dur: '8.6s',  anim: 'so-float-a' },
            { top: '40%', left: '92%',  size: 1,   delay: '0.9s', dur: '13.5s', anim: 'so-float-b' },
            { top: '82%', left: '55%',  size: 1,   delay: '5.2s', dur: '10.4s', anim: 'so-float-c' },
          ].map((p, i) => (
            <span key={i} style={{
              position:     'absolute',
              top:          p.top,
              left:         p.left,
              width:        `${p.size}px`,
              height:       `${p.size}px`,
              borderRadius: '50%',
              background:   'rgba(235,230,219,0.55)',
              animation:    `${p.anim} ${p.dur} ease-in-out ${p.delay} infinite`,
            }} />
          ))}
        </div>

        {/* Logo CH */}
        <Image
          src="/LOGO_FINAL.png"
          alt="Cuscus monogram"
          width={200}
          height={200}
          className="block object-contain"
          style={{
            width:     'clamp(44px, 8vw, 62px)',
            height:    'auto',
            filter:    'brightness(0) invert(1)',
            animation: 'so-logo 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s both',
            position:  'relative',
            zIndex:    1,
          }}
        />

        <div style={{ height: '22px' }} />

        {/* SOLD OUT — brillo vía background-clip:text, sin overflow:hidden */}
        <div style={{ position: 'relative', display: 'inline-block', zIndex: 1 }}>
          {/* Desenfoque gaussiano con máscara radial — sin bordes rectangulares */}
          <div
            aria-hidden
            style={{
              position:              'absolute',
              inset:                 '-36px -72px',
              backdropFilter:        'blur(18px)',
              WebkitBackdropFilter:  'blur(18px)',
              mask:                  'radial-gradient(ellipse 78% 68% at 50% 50%, black 20%, transparent 72%)',
              WebkitMask:            'radial-gradient(ellipse 78% 68% at 50% 50%, black 20%, transparent 72%)',
              pointerEvents:         'none',
            }}
          />
          <h2
            className="font-gothic uppercase leading-none"
            style={{
              position:              'relative',
              fontSize:              'clamp(56px, 15vw, 104px)',
              letterSpacing:         '0.06em',
              background:            'linear-gradient(105deg, rgba(235,230,219,0.86) 0%, var(--bone) 38%, rgba(255,255,255,1) 50%, var(--bone) 62%, rgba(235,230,219,0.86) 100%)',
              backgroundSize:        '300% 100%',
              WebkitBackgroundClip:  'text',
              WebkitTextFillColor:   'transparent',
              backgroundClip:        'text',
              animation:             'so-rise 1s cubic-bezier(0.22,1,0.36,1) 0.2s both, so-breathe 6s ease-in-out 1.4s infinite, so-shine 1.1s ease 1.1s 1 forwards',
              userSelect:            'none',
            }}
          >
            Sold Out
          </h2>
        </div>

        <div style={{ height: '18px' }} />

        {/* Regla */}
        <div
          style={{
            width: '40px', height: '1px',
            background: 'rgba(235,230,219,0.2)',
            transformOrigin: 'center',
            animation: 'so-rule 0.6s cubic-bezier(0.22,1,0.36,1) 0.65s both',
          }}
        />

        <div style={{ height: '16px' }} />

        {/* Mensaje */}
        <p
          className="font-mono uppercase text-bone"
          style={{
            fontSize:      '13px',
            letterSpacing: '0.44em',
            animation:     'so-reveal 1s cubic-bezier(0.22,1,0.36,1) 0.85s both',
            position:      'relative',
            zIndex:        1,
          }}
        >
          Este drop ya encontró a sus dueños.
        </p>

        <div style={{ height: '7px' }} />

        {/* Producto */}
        <p
          className="font-mono uppercase"
          style={{
            fontSize:      '7.5px',
            letterSpacing: '0.38em',
            color:         'rgba(235,230,219,0.3)',
            animation:     'so-rise 0.7s cubic-bezier(0.22,1,0.36,1) 1.05s both',
          }}
        >
          Cuscus Hats · Gorra edición limitada
        </p>

      </div>
    </>
  );
}

// ── LandingDrop ───────────────────────────────────────────────────────────────

export default function LandingDrop({
  showForm,
  showCountdown,
}: {
  showForm:      boolean;
  showCountdown: boolean;
}) {
  const [stage, setStage] = useState<Stage>('pre_drop');

  useEffect(() => {
    fetch(`${API_URL}/api/drop/state`)
      .then(r => r.json())
      .then(d => { if (d.stage) setStage(d.stage as Stage); })
      .catch(() => {});

    const socket = io(API_URL, { transports: ['websocket', 'polling'] });
    socket.on('drop:state', ({ stage: s }: { stage: Stage }) => setStage(s));
    return () => { socket.disconnect(); };
  }, []);

  if (stage === 'sold_out') return <SoldOutView />;

  // ── Pre-drop ──────────────────────────────────────────────────────────────

  return (
    <>
      {/* LIMITED · LOGO · DROP */}
      <div className="grid items-center w-full" style={{ gridTemplateColumns: '1fr auto 1fr', gap: '12px' }}>
        <span className="font-mono font-bold text-[10px] sm:text-[11px] tracking-[0.28em] text-bone uppercase text-right">
          Limited
        </span>
        <Image
          src="/LOGO_FINAL.png"
          alt="Cuscus monogram"
          width={200}
          height={200}
          priority
          className="object-contain w-[26vw] h-[26vw] max-w-[110px] max-h-[110px] sm:max-w-[120px] sm:max-h-[120px] md:max-w-[135px] md:max-h-[135px] block shrink-0"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
        <span className="font-mono font-bold text-[10px] sm:text-[11px] tracking-[0.28em] text-bone uppercase text-left">
          Drop
        </span>
      </div>

      {showForm && (
        <div className="w-full flex flex-col items-center mt-3 sm:mt-4">
          <SignupForm />
        </div>
      )}

      {showCountdown && <Countdown />}
    </>
  );
}
