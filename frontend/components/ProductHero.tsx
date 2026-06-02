import StockBadge      from './StockBadge';
import PreBuyButton    from './PreBuyButton';
import ProductViewer360 from './ProductViewer360';

interface Props {
  available: number | null;
  price:     string;
  currency:  string;
}

export default function ProductHero({ available, price, currency }: Props) {
  return (
    <section className="w-full max-w-[1100px] mx-auto px-4 sm:px-8 lg:px-12 pt-4 sm:pt-10 pb-16
                        grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 lg:gap-16 items-center">

      {/* ── Columna izquierda: Visor 360° ─────────────────────────────────── */}
      <ProductViewer360 />

      {/* ── Columna derecha: Info ─────────────────────────────────────────── */}
      <div className="flex flex-col items-center sm:items-start gap-5 w-full">

        {/* Marca */}
        <div className="flex items-center gap-3">
          <div className="w-5 h-[1px] bg-[var(--bone-3)]" />
          <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-bone-3">Cuscus Hats</span>
          <div className="w-5 h-[1px] bg-[var(--bone-3)]" />
        </div>

        {/* Nombre */}
        <div className="text-center sm:text-left">
          <h1 className="font-gothic text-[clamp(40px,8vw,64px)] uppercase leading-none tracking-wider text-bone">
            Gorra
          </h1>
          <h2 className="font-garamond text-[clamp(15px,2.5vw,22px)] italic text-bone-2 leading-snug mt-1">
            Edición Limitada — Drop #1
          </h2>
        </div>

        {/* Descripción */}
        <p className="font-garamond text-[15px] text-bone-3 leading-relaxed text-center sm:text-left">
          Solo <strong className="text-bone font-normal">100 unidades</strong> en el mundo.
          Diseño exclusivo, calidad premium. Una vez agotado, no vuelve.
        </p>

        {/* Características */}
        <ul className="flex flex-col gap-2 w-full">
          {[
            'Edición completamente limitada — 100 unidades',
            'Material premium de alta durabilidad',
            'Diseño exclusivo Cuscus Hats',
            'Despacho a todo Colombia',
          ].map(item => (
            <li key={item} className="flex items-start gap-2 font-mono text-[12px] tracking-[0.15em] uppercase text-bone-3">
              <span className="text-bone mt-[1px] shrink-0">—</span>
              {item}
            </li>
          ))}
        </ul>

        {/* Precio */}
        <div className="flex items-baseline gap-3">
          <span className="font-gothic text-[clamp(32px,5vw,44px)] text-bone leading-none">
            {currency === 'USD' ? '$' : ''}{price}
          </span>
          <span className="font-mono text-[11px] tracking-[0.28em] text-bone-3 uppercase">{currency}</span>
        </div>

        {/* Stock + CTA */}
        <div className="flex flex-col gap-4 w-full">
          <StockBadge available={available} />
          <PreBuyButton available={available} />
        </div>

        {/* Garantías */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center sm:justify-start">
          {['Pago 100% seguro', 'Envío a todo Colombia', 'Soporte vía WhatsApp'].map(g => (
            <span key={g} className="font-mono text-[9px] tracking-[0.18em] uppercase text-bone-3 flex items-center gap-1">
              <span className="text-[#3ecf8e]">✓</span> {g}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
}
