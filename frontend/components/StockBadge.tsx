export default function StockBadge({
  available,
  total = 100,
}: {
  available: number | null;
  total?:    number;
}) {
  const pct      = available !== null ? Math.max(0, (available / total) * 100) : null;
  const low      = pct !== null && pct < 30;
  const critical = pct !== null && pct < 10;

  const barColor = critical
    ? '#e05c5c'
    : low
    ? 'linear-gradient(90deg, #f5c842, #e05c5c)'
    : 'linear-gradient(90deg, var(--bone-3), var(--bone))';

  return (
    <div className="flex flex-col gap-[10px] w-full">

      {/* Progress bar */}
      <div className="w-full h-px bg-[var(--line)] relative overflow-hidden">
        {pct !== null && (
          <div
            className="absolute left-0 top-0 h-full transition-all duration-700"
            style={{ width: `${pct}%`, background: barColor }}
          />
        )}
      </div>

      {/* Label row */}
      <div className="flex items-center justify-between w-full font-mono text-[9px] sm:text-[10px] tracking-[0.28em] uppercase">
        {available === null ? (
          <span className="text-bone-3">Verificando disponibilidad...</span>
        ) : available <= 0 ? (
          <span className="text-[#e05c5c]">Agotado &mdash; sin reposición</span>
        ) : (
          <>
            <span className={critical ? 'text-[#e05c5c]' : low ? 'text-[#f5c842]' : 'text-bone-2'}>
              {available}&nbsp;{available === 1 ? 'unidad disponible' : 'unidades disponibles'}
            </span>
            <span className="text-bone-3 opacity-60">
              {total}&nbsp;total
            </span>
          </>
        )}
      </div>
    </div>
  );
}
