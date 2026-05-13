import Image       from 'next/image';
import Starfield   from '@/components/Starfield';
import ShootingStars from '@/components/ShootingStars';
import LandingDrop from '@/components/LandingDrop';
import Footer      from '@/components/Footer';
import { DROP_PHASE, DROP_CONFIG } from '@/lib/drop';

export default function Home() {
  const config = DROP_CONFIG[DROP_PHASE];

  return (
    <>
      <main
        className="flex-1 relative flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden"
        style={{
          paddingTop: '24px',
          paddingBottom: '10px',
          backgroundImage: "url('/fondo.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 35%, rgba(0,0,0,0.65) 58%, rgba(0,0,0,0.92) 100%)',
          }}
        />

        <Starfield />
        <ShootingStars />

        <section className="relative z-[5] flex flex-col items-center text-center w-full max-w-[580px] gap-[6px] sm:gap-[5px]">

          {/* Wordmark — siempre visible */}
          <h1 className="leading-none mb-1">
            <Image
              src="/NOMBRE_FINAL.png"
              alt="Cuscus Hats"
              width={520}
              height={160}
              priority
              className="w-[82vw] max-w-[300px] sm:max-w-[340px] md:max-w-[400px] h-auto object-contain block"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </h1>

          {/* Badge · Form · Countdown — o pantalla Sold Out según estado global */}
          <LandingDrop
            showForm={config.showForm}
            showCountdown={config.showCountdown}
          />

          {/* Live CTA — solo en fase live */}
          {config.showBuyButton && (
            <a
              href="#"
              className="w-full max-w-[440px] bg-bone text-ink border border-bone py-[14px] px-4 font-mono text-[11px] tracking-[0.32em] uppercase flex items-center justify-center gap-3 transition-all duration-200 hover:bg-transparent hover:text-bone"
            >
              Comprar ahora
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0 L13 10 L24 12 L13 14 L12 24 L11 14 L0 12 L11 10 Z" />
              </svg>
            </a>
          )}

        </section>
      </main>

      <Footer />
    </>
  );
}
