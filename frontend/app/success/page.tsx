import Image from 'next/image';
import Link  from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center gap-8">
      <Image
        src="/LOGO_FINAL.png"
        alt="Cuscus Hats"
        width={60} height={60}
        className="object-contain"
        style={{ filter: 'brightness(0) invert(1)' }}
      />

      <div className="flex flex-col gap-3">
        <span className="font-mono text-[11px] tracking-[0.4em] uppercase text-[#3ecf8e]">
          ✓ Compra confirmada
        </span>
        <h1 className="font-gothic text-[clamp(32px,6vw,60px)] uppercase leading-none text-bone">
          Gracias
        </h1>
        <p className="font-garamond text-[18px] italic text-bone-2 max-w-[400px]">
          Tu gorra Drop #1 está reservada. Recibirás un correo con los detalles del envío pronto.
        </p>
      </div>

      <div className="w-10 h-[1px] bg-[var(--line)]" />

      <div className="flex flex-col gap-2">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-bone-3">
          Dudas o seguimiento del pedido
        </p>
        <a
          href="https://instagram.com/cuscus_hats"
          className="font-mono text-[10px] tracking-[0.22em] uppercase text-bone hover:text-bone-2 transition-colors"
          target="_blank" rel="noopener noreferrer"
        >
          @cuscus_hats
        </a>
      </div>

      <Link
        href="/"
        className="font-mono text-[10px] tracking-[0.3em] uppercase text-bone-3 hover:text-bone transition-colors border border-[var(--line)] px-4 py-2"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
